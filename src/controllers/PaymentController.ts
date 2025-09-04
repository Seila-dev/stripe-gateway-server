import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { PaymentMethod } from '../types/paymentTypes';
import { logger } from '../utils/logger';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        customerId,
        amount,
        currency = 'BRL',
        method,
        cardToken
      } = req.body;

      const idempotencyKey = req.headers['x-idempotency-key'] as string;

      const payment = await this.paymentService.createPayment({
        customerId,
        amount,
        currency,
        method,
        cardToken,
        idempotencyKey
      });

      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Error creating payment:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPayment(id);

      if (!payment) {
        res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
        return;
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Error getting payment:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };

  refundPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const payment = await this.paymentService.refundPayment(id, amount);

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      logger.error('Error refunding payment:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}