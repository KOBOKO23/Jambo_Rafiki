# Stripe Backend Configuration Handoff (Frontend Integrated)

Date: 15 April 2026

This document explains what backend needs to configure so the current frontend Stripe donation flow works in production.

## 1) Do You Need To Pay Stripe Upfront?

Short answer:
- No upfront subscription is required to start.
- Stripe charges per successful live transaction.
- Test mode is free.

Practical guidance:
- You can fully integrate and test end to end in test mode without paying.
- Charges happen only when using live keys and processing real payments.

## 2) Frontend Status

Frontend Stripe flow is already implemented.

Current frontend behavior:
1. User enters card details in Stripe Elements fields:
- Card Number
- Expiry Date
- CVV

2. Frontend calls backend to create a PaymentIntent:
- POST /api/v1/donations/stripe/

3. Backend returns client_secret.

4. Frontend confirms payment with Stripe using client_secret:
- stripe.confirmCardPayment(client_secret, payment_method)

5. Frontend shows result based on payment status:
- succeeded
- processing

Important:
- Frontend never sends raw card details to backend.
- Backend receives donation metadata and creates PaymentIntent.

## 3) Required Backend Env Variables

Set these in backend environment:

1. STRIPE_SECRET_KEY
- Used by backend to create PaymentIntent.

2. STRIPE_WEBHOOK_SECRET
- Used to verify Stripe webhook signatures.

3. STRIPE_PUBLISHABLE_KEY (optional but useful to expose to frontend deployment pipeline)
- Frontend uses VITE_STRIPE_KEY.

## 4) Required Frontend Env Variable

Set in frontend deployment:

- VITE_STRIPE_KEY=pk_live_xxx (or pk_test_xxx for test)

Without this key, card input is shown as unavailable and users should use M-Pesa.

## 5) Backend Endpoint Contract Needed

Endpoint:
- POST /api/v1/donations/stripe/

Expected request payload from frontend:
- donor_name
- donor_email
- amount
- currency (USD currently)
- donation_type (one_time or monthly)
- purpose
- message
- is_anonymous
- payment_method_id (optional)

Expected response from backend:
- message
- donation_id
- payment_intent_id
- client_secret
- status

Recommended status code:
- 202 Accepted

## 6) Webhook Configuration Required

Stripe Dashboard webhook endpoint:
- POST /api/v1/donations/stripe-webhook/

Required events at minimum:
1. payment_intent.succeeded
2. payment_intent.payment_failed
3. payment_intent.processing
4. charge.refunded (if refunds are supported)

Backend webhook requirements:
- Verify Stripe signature with STRIPE_WEBHOOK_SECRET.
- Idempotently persist callback events.
- Update donation status in database.

## 7) Backend Business Rules To Confirm

1. Amount handling:
- Validate amount > 0
- Convert to Stripe minor units correctly

2. Currency handling:
- Frontend currently sends USD for card flow
- Backend should enforce/validate supported currencies

3. Metadata:
- Include donation_id and donor_email in PaymentIntent metadata for reconciliation

4. Error payloads:
- Return clear messages for 400, 403, 429, 500

## 8) End To End Test Checklist

In test mode:
1. Submit card donation from frontend using Stripe test card
2. Confirm frontend gets success/processing state
3. Confirm backend donation row created
4. Confirm webhook updates donation status
5. Confirm duplicate webhook delivery is safely ignored

## 9) Notes For Production Launch

1. Switch to live Stripe keys in both frontend and backend.
2. Ensure webhook endpoint is HTTPS and publicly reachable.
3. Add monitoring/alerts for webhook failures.
4. Keep test and live keys separated by environment.

## 10) Frontend Files Updated For Stripe Flow

- src/components/DonationForm.tsx

This file now confirms card payments on frontend using backend-issued client_secret.
