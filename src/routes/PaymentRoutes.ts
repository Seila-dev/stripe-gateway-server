import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { validationMiddleware } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { body, param } from 'express-validator';

export const createPaymentRoutes = (paymentController: PaymentController) => {
  const router = Router();

  router.post(
    '/payments',
    authMiddleware,
    idempotencyMiddleware,
    [
      body('customerId').isUUID().withMessage('Valid customer ID required'),
      body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
      body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
      body('method').isIn(['credit_card', 'pix']).withMessage('Invalid payment method'),
      body('cardToken').optional().isString().withMessage('Card token must be a string')
    ],
    validationMiddleware,
    paymentController.createPayment
  );

  router.get(
    '/payments/:id',
    authMiddleware,
    [
      param('id').isUUID().withMessage('Valid payment ID required')
    ],
    validationMiddleware,
    paymentController.getPayment
  );

  router.post(
    '/payments/:id/refund',
    authMiddleware,
    [
      param('id').isUUID().withMessage('Valid payment ID required'),
      body('amount').optional().isFloat({ min: 0.01 }).withMessage('Refund amount must be greater than 0')
    ],
    validationMiddleware,
    paymentController.refundPayment
  );

  return router;
};