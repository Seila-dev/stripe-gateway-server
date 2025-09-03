# Stripe Gateway Side-project
Gonna be using Node.js, Express, PostgreSQL, Redis and other technologies to define this build

## Structure
<pre>
    payment-gateway/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   │   ├── PaymentController.ts
    │   │   │   ├── WebhookController.ts
    │   │   │   └── RefundController.ts
    │   │   ├── services/
    │   │   │   ├── PaymentService.ts
    │   │   │   ├── StripeService.ts
    │   │   │   ├── PixService.ts
    │   │   │   ├── CacheService.ts
    │   │   │   └── IdempotencyService.ts
    │   │   ├── models/
    │   │   │   ├── Payment.ts
    │   │   │   ├── Transaction.ts
    │   │   │   └── Customer.ts
    │   │   ├── middleware/
    │   │   │   ├── auth.ts
    │   │   │   ├── validation.ts
    │   │   │   ├── idempotency.ts
    │   │   │   └── errorHandler.ts
    │   │   ├── routes/
    │   │   │   ├── payments.ts
    │   │   │   ├── webhooks.ts
    │   │   │   └── refunds.ts
    │   │   ├── database/
    │   │   │   ├── migrations/
    │   │   │   ├── seeds/
    │   │   │   └── connection.ts
    │   │   ├── utils/
    │   │   │   ├── logger.ts
    │   │   │   ├── encryption.ts
    │   │   │   └── validators.ts
    │   │   ├── types/
    │   │   │   ├── payment.types.ts
    │   │   │   └── api.types.ts
    │   │   └── app.ts
    │   ├── tests/
    │   │   ├── unit/
    │   │   └── integration/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── Dockerfile
    │   └── .env.example
    ├── frontend/ (on another repository)
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── checkout/
    │   │   │   │   └── page.tsx
    │   │   │   ├── payment/
    │   │   │   │   └── [id]/
    │   │   │   │       └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── components/
    │   │   │   ├── checkout/
    │   │   │   │   ├── PaymentForm.tsx
    │   │   │   │   ├── PixPayment.tsx
    │   │   │   │   └── CardPayment.tsx
    │   │   │   ├── ui/
    │   │   │   │   ├── Button.tsx
    │   │   │   │   ├── Input.tsx
    │   │   │   │   └── Modal.tsx
    │   │   │   └── layout/
    │   │   │       ├── Header.tsx
    │   │   │       └── Footer.tsx
    │   │   ├── lib/
    │   │   │   ├── api.ts
    │   │   │   ├── stripe.ts
    │   │   │   └── utils.ts
    │   │   ├── hooks/
    │   │   │   ├── usePayment.ts
    │   │   │   └── useCheckout.ts
    │   │   └── types/
    │   │       └── payment.types.ts
    │   ├── package.json
    │   ├── next.config.js
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    ├── docker-compose.yml
    ├── .github/
    │   └── workflows/
    │       ├── backend-ci.yml
    │       └── frontend-ci.yml
</pre>