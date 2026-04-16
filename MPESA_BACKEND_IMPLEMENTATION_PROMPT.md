# M-Pesa Donation Push Notification Backend Implementation Brief

Use this document as the backend implementation prompt for the Jambo Rafiki donation flow.

## Goal

Implement a reliable M-Pesa STK Push donation flow that works with the current frontend donation form and existing API contract. The frontend already submits donation requests; the backend must actually trigger the push notification, persist the donation, and finalize the payment through the callback.

## Important Context

- Frontend donation form already supports M-Pesa and Stripe.
- The frontend sends donation data to `POST /api/v1/donations/mpesa/` or `POST /api/v1/donations/mpesa-sync/`.
- The frontend expects the backend to send a real M-Pesa push notification to the user phone.
- The push notification is not a frontend responsibility.
- Callback and webhook endpoints are provider/backend only and must not be called by the browser.

## Current Frontend Contract

The frontend sends this payload for M-Pesa donations:

```json
{
  "donor_name": "Jane Doe",
  "donor_email": "jane@example.com",
  "donor_phone": "254712345678",
  "amount": 1000,
  "currency": "KES",
  "donation_type": "one_time",
  "purpose": "general",
  "message": "",
  "is_anonymous": false
}
```

## Backend Endpoints To Implement Or Verify

### Public donation initiation

#### `POST /api/v1/donations/mpesa/`
- Purpose: Queue-backed STK Push initiation.
- Response: `202 Accepted` preferred.
- Must create a donation record first, then start the push.
- Must return `checkout_request_id` and `merchant_request_id` when available.
- Must return a clear user message like: `Please check your phone for M-Pesa prompt`.

#### `POST /api/v1/donations/mpesa-async/`
- Purpose: Explicit async alias for the same flow as `/mpesa/`.
- Can return the same shape as `/mpesa/`.

#### `POST /api/v1/donations/mpesa-sync/`
- Purpose: Immediate STK Push initiation.
- Can be used for direct synchronous initiation if queue processing is not desired.
- Response should still include identifiers and a user-facing message.

### Provider callback

#### `POST /api/v1/donations/mpesa-callback/`
- Purpose: Safaricom callback endpoint.
- Must be public, but treated as provider/backend only.
- Must be replay-safe and idempotent.
- Should update donation state based on `ResultCode` and payment details.
- Should return HTTP 200 with a valid `ResultCode` acknowledgment.

## Expected Response Shapes

### Successful donation initiation

```json
{
  "message": "Please check your phone for M-Pesa prompt",
  "donation_id": 101,
  "job_id": 9001,
  "status": "pending",
  "checkout_request_id": "ws_CO_1234567890",
  "merchant_request_id": "12345-abcde"
}
```

### Successful sync initiation

```json
{
  "message": "Please check your phone for M-Pesa prompt",
  "donation_id": 101,
  "checkout_request_id": "ws_CO_1234567890",
  "merchant_request_id": "12345-abcde"
}
```

### Callback success acknowledgment

```json
{
  "ResultCode": 0,
  "ResultDesc": "Accepted"
}
```

## Donation Status Lifecycle

Use these statuses consistently:

- `pending` - created locally, push not yet confirmed
- `processing` - STK Push sent, waiting for callback
- `completed` - payment confirmed via callback
- `failed` - payment failed or rejected
- `refunded` - refunded later if supported
- `cancelled` - cancelled by system or user flow

## Required Backend Behavior

### 1. Normalize phone number

Accept and normalize Kenya mobile numbers to `2547XXXXXXXX` format.

Example logic:

```python
def normalize_phone(phone: str) -> str:
    digits = ''.join(ch for ch in phone if ch.isdigit())
    if digits.startswith('0') and len(digits) == 10:
        return '254' + digits[1:]
    if digits.startswith('7') and len(digits) == 9:
        return '254' + digits
    if digits.startswith('254') and len(digits) == 12:
        return digits
    raise ValueError('Invalid phone number format')
```

### 2. Create donation first

Before calling Safaricom, create a donation record with:

- donor name
- donor email
- donor phone
- amount
- currency
- donation type
- purpose
- message
- anonymous flag
- payment method = `mpesa`
- status = `pending`

### 3. Initiate STK Push

Call the Safaricom Daraja STK Push API using the normalized phone number.

Required request fields typically include:

- BusinessShortCode
- Password
- Timestamp
- TransactionType
- Amount
- PartyA
- PartyB
- PhoneNumber
- CallBackURL
- AccountReference
- TransactionDesc

### 4. Persist provider IDs

Store the provider identifiers returned by the STK Push request:

- `checkout_request_id`
- `merchant_request_id`

These are needed for reconciliation and callback matching.

### 5. Update donation status after push initiation

After a successful push request, update donation status to `processing`.

### 6. Process callback idempotently

The callback handler must:

- verify callback authenticity if token/signature is configured
- find the donation by `CheckoutRequestID` or `MerchantRequestID`
- avoid duplicate processing if callback is replayed
- mark the donation `completed` when `ResultCode === 0`
- mark the donation `failed` otherwise
- store transaction details and raw callback payload for audit

## Recommended Database Fields

If not already present, the donation model should persist:

- `payment_method`
- `status`
- `amount`
- `currency`
- `donor_name`
- `donor_email`
- `donor_phone`
- `purpose`
- `message`
- `is_anonymous`
- `checkout_request_id`
- `merchant_request_id`
- `transaction_id`
- `mpesa_receipt`
- `mpesa_phone`
- `completed_at`
- `updated_at`
- `raw_callback` or equivalent audit field

## Queue / Worker Expectations

If the flow is queue-backed:

- enqueue donation initiation job immediately
- return the donation record and job id fast
- worker performs the STK Push call
- worker updates the donation record with provider ids and status

If the worker is not running, the user will not receive a push notification.

## Common Reasons Push Does Not Reach The Phone

Please verify these carefully:

- backend never calls Daraja STK Push
- wrong phone number format
- wrong shortcode or passkey
- wrong environment (sandbox vs production)
- callback URL not reachable publicly
- queue worker not running
- provider request is failing silently
- callback is received but not updating the donation record

## Logging Requirements

Log these events for troubleshooting:

- request received for `mpesa` donation
- normalized phone number
- STK Push request payload metadata
- STK Push response from Daraja
- callback receipt
- callback parsed result code
- donation status transition

Do not log secret values such as passkeys or access tokens.

## Frontend Alignment Rules

The frontend already expects:

- `POST /api/v1/donations/mpesa/` for M-Pesa initiation
- `POST /api/v1/donations/mpesa-sync/` as a sync alternative
- `POST /api/v1/donations/mpesa-callback/` for provider callback only
- `GET /api/v1/donations/reconciliation/` for operations/admin summary

Do not change the frontend to call callback endpoints directly.

## Stripe Note

Stripe is already handled separately by the frontend through `POST /api/v1/donations/stripe/` and webhook confirmation. Do not mix the Stripe confirmation flow with M-Pesa STK Push.

## Acceptance Criteria

- Clicking Donate on the frontend sends a real STK Push to the donor phone.
- Donation record is created and moved to `processing` when push is initiated.
- Callback updates the record to `completed` or `failed`.
- Frontend sees a clear response and can show the correct success message.
- Replays do not duplicate donations or double-process callbacks.
- Reconciliation endpoint reflects the new transaction state.

## Suggested Final Response From Backend Endpoint

On successful initiation, return something like:

```json
{
  "message": "Please check your phone for M-Pesa prompt",
  "donation_id": 101,
  "job_id": 9001,
  "status": "processing",
  "checkout_request_id": "ws_CO_1234567890",
  "merchant_request_id": "12345-abcde"
}
```

## Final Note

If the user reports that no push notification arrives, the issue is almost always backend-side: API credentials, phone format, queue worker, callback, or environment mismatch. The frontend is already prepared to submit the request correctly.
