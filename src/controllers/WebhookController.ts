import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { StripeService } from '../services/StripeService';
import { logger } from '../utils/logger';

export class WebhookController {
  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService
  ) {}

  stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const payload = req.body;

      const event = await this.stripeService.constructWebhookEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      await this.paymentService.handleWebhook('stripe', event);

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Stripe webhook error:', error);
      res.status(400).json({
        success: false,
        error: 'Webhook signature verification failed'
      });
    }
  };

  pixWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body;
      await this.paymentService.handleWebhook('pix', payload);

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('PIX webhook error:', error);
      res.status(400).json({
        success: false,
        error: 'Webhook processing failed'
      });
    }
  };
}