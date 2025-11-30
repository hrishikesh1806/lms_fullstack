# Fix Payment Confirmation Issue

## Problem
- User enters card details on Stripe checkout, clicks pay, but gets "Payment confirmation failed" on payment-success page.
- Root cause: Mismatch in how purchaseId is handled between purchase creation, success URL, and confirmation logic.

## Steps to Fix
- [x] Update `purchaseCourse` in `server/controllers/userController.js` to use `purchase._id` as purchaseId in success_url and metadata after saving purchase.
- [x] Update `confirmPayment` in `server/controllers/userController.js` to find purchase by `_id` instead of `stripeSessionId`.
- [x] Update `stripeWebhooks` in `server/controllers/webhooks.js` to find purchase by `_id` using purchaseId from metadata.
- [x] Fix Purchase model to make stripeSessionId not required initially.
- [x] Test with valid Stripe test card "4242 4242 4242 4242" to ensure payment succeeds and confirmation works.
- [x] Verify webhook setup if needed, but manual confirmation should work after fixes.

## Notes
- Ensure STRIPE_SECRET_KEY and FRONTEND_URL are set in .env.
- If webhook is configured, it will also work after adding purchaseId to metadata.
