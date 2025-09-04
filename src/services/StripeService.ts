import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil'
    });
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    cardToken: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: data.amount * 100, 
      currency: data.currency,
      payment_method_data: {
        type: 'pix',
        pix: {
          token: data.cardToken
        }
      },
      confirm: true,
      metadata: data.metadata
    });
  }

  async refundPayment(paymentIntentId: string, amount: number): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount * 100
    });
  }

  async constructWebhookEvent(payload: string, signature: string, secret: string): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}