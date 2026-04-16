# Donation Frontend to Backend Handoff (15 April 2026)

This document captures donation-specific frontend changes and the backend contract expectations required to keep both sides aligned.

## 1) UX and Flow Changes Implemented in Frontend

1. The three cards under "Your Donation at Work" are now actionable:
- Education Transforms: KES 1,000
- Learning Empowers: KES 5,000
- Health Matters: KES 10,000

2. On card click, frontend now:
- scrolls to the donation form section with smooth behavior
- pre-fills the donation amount automatically

3. Bank Transfer option has been removed from the donation form UI.

4. Payment methods shown to users are now:
- M-Pesa
- Card

5. Card input was upgraded to industry-standard split fields using Stripe Elements:
- Card Number
- Expiry Date
- CVV

## 2) Frontend Payloads Sent to Backend

### M-Pesa submit
Endpoint used by frontend:
- POST /api/v1/donations/mpesa/

Payload shape:
- donor_name: string
- donor_email: string
- donor_phone: string
- amount: number
- currency: "KES"
- donation_type: "one_time" or "monthly"
- purpose: string
- message: string
- is_anonymous: boolean

Expected success behavior:
- 202 accepted (queued flow)

### Card submit (Stripe init)
Endpoint used by frontend:
- POST /api/v1/donations/stripe/

Payload shape:
- donor_name: string
- donor_email: string
- amount: number
- currency: "USD"
- donation_type: "one_time" or "monthly"
- purpose: string
- message: string
- is_anonymous: boolean
- payment_method_id: string (created in frontend via Stripe)

Expected success behavior:
- 202 accepted (payment intent initiated)

## 3) Response Handling Expected by Frontend

### M-Pesa
Frontend supports:
- message
- donation_id
- optional job_id
- optional status
- optional checkout_request_id
- optional merchant_request_id

### Stripe
Frontend expects:
- message
- donation_id
- payment_intent_id
- client_secret
- status

## 4) Validation and Error Handling Expectations

Frontend now centrally handles API errors and expects meaningful backend responses for:
- 400 validation errors (field-level serializer errors preferred)
- 403 permission errors
- 429 throttling
- 500+ server errors

For throttling and validation, clear error payloads improve user feedback directly.

## 5) Suggested Backend Additions (Optional, Recommended)

These are optional enhancements that improve observability and analytics for the new card-click prefill flow:

1. Accept optional donation_source in donation payloads:
- values like: impact_card, custom_amount, donation_page

2. Accept optional campaign_hint in donation payloads:
- values like: education_transforms, learning_empowers, health_matters

3. If accepted, include these fields in donation records and admin reporting.

Note: Frontend does not currently send these optional fields yet, but can be extended quickly if backend supports them.

## 6) Security and Compliance Notes

1. Card data is handled through Stripe Elements only.
2. Frontend never sends raw card number, expiry, or CVV to backend.
3. Backend only receives Stripe payment_method_id and donation metadata.

## 7) Files Changed in Frontend for This Donation Update

- src/components/DonationForm.tsx
- pages/Donations/DonationPage.tsx
- pages/Donations/DonationFormSection.tsx
- src/test/donation-form.test.tsx

## 8) Backend Verification Checklist

1. Confirm POST /api/v1/donations/mpesa/ accepts the exact fields above.
2. Confirm POST /api/v1/donations/stripe/ accepts optional payment_method_id.
3. Confirm stripe response includes payment_intent_id and client_secret.
4. Confirm donation_type supports one_time and monthly.
5. Confirm no bank transfer flow is required by frontend anymore.
