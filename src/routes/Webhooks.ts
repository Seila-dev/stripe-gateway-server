import { Router } from 'express';
import { WebhookController } from '../controllers/WebhookController';

export const createWebhookRoutes = (webhookController: WebhookController) => {
  const router = Router();

  router.post('/webhooks/stripe', webhookController.stripeWebhook);
  router.post('/webhooks/pix', webhookController.pixWebhook);

  return router;
};