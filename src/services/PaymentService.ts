import { Payment, PaymentStatus, PaymentMethod } from '../types/paymentTypes';
import { StripeService } from './StripeService';
import { PixService } from './PixService';
import { CacheService } from './CacheService';
import { IdempotencyService } from './IdempotencyService';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  constructor(
    private stripeService: StripeService,
    private pixService: PixService,
    private cacheService: CacheService,
    private idempotencyService: IdempotencyService
  ) {}

  async createPayment(
    paymentData: {
      customerId: string;
      amount: number;
      currency: string;
      method: PaymentMethod;
      cardToken?: string;
      idempotencyKey?: string;
    }
  ): Promise<Payment> {
    const { idempotencyKey } = paymentData;

    // Verificar idempotência
    if (idempotencyKey) {
      const existingPayment = await this.idempotencyService.getPayment(idempotencyKey);
      if (existingPayment) {
        logger.info(`Returning cached payment for idempotency key: ${idempotencyKey}`);
        return existingPayment;
      }
    }

    const paymentId = uuidv4();
    const payment: Payment = {
      id: paymentId,
      customerId: paymentData.customerId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: PaymentStatus.PENDING,
      method: paymentData.method,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      if (paymentData.method === PaymentMethod.CREDIT_CARD) {
        await this.processCreditCardPayment(payment, paymentData.cardToken!);
      } else if (paymentData.method === PaymentMethod.PIX) {
        await this.processPixPayment(payment);
      }

      // Salvar no cache e banco
      await this.cacheService.set(`payment:${payment.id}`, payment, 3600);
      await this.savePayment(payment);

      // Salvar idempotência
      if (idempotencyKey) {
        await this.idempotencyService.savePayment(idempotencyKey, payment);
      }

      logger.info(`Payment created: ${payment.id}`);
      return payment;
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      await this.savePayment(payment);
      logger.error(`Payment failed: ${payment.id}`, error);
      throw error;
    }
  }

  private async processCreditCardPayment(payment: Payment, cardToken: string): Promise<void> {
    const result = await this.stripeService.createPaymentIntent({
      amount: payment.amount,
      currency: payment.currency,
      cardToken,
      metadata: { paymentId: payment.id }
    });

    payment.providerTransactionId = result.id;
    payment.status = result.status === 'succeeded' ? PaymentStatus.PAID : PaymentStatus.PENDING;
  }

  private async processPixPayment(payment: Payment): Promise<void> {
    const pixData = await this.pixService.createPixPayment({
      amount: payment.amount,
      description: `Payment ${payment.id}`,
      expiresIn: 3600
    });

    payment.pixCode = pixData.pixCode;
    payment.expiresAt = pixData.expiresAt;
    payment.providerTransactionId = pixData.transactionId;
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    // Tentar buscar no cache primeiro
    let payment = await this.cacheService.get(`payment:${paymentId}`);
    
    if (!payment) {
      // Buscar no banco de dados
      payment = await this.findPaymentById(paymentId);
      if (payment) {
        await this.cacheService.set(`payment:${paymentId}`, payment, 3600);
      }
    }

    return payment;
  }

  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.getPayment(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.PAID) {
      throw new Error('Payment cannot be refunded');
    }

    const refundAmount = amount || payment.amount;

    if (payment.method === PaymentMethod.CREDIT_CARD) {
      await this.stripeService.refundPayment(
        payment.providerTransactionId!,
        refundAmount
      );
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.updatedAt = new Date();

    await this.savePayment(payment);
    await this.cacheService.delete(`payment:${paymentId}`);

    logger.info(`Payment refunded: ${paymentId}`);
    return payment;
  }

  async handleWebhook(provider: string, payload: any): Promise<void> {
    if (provider === 'stripe') {
      await this.handleStripeWebhook(payload);
    } else if (provider === 'pix') {
      await this.handlePixWebhook(payload);
    }
  }

  private async handleStripeWebhook(payload: any): Promise<void> {
    const { type, data } = payload;
    
    if (type === 'payment_intent.succeeded') {
      const paymentIntent = data.object;
      const paymentId = paymentIntent.metadata.paymentId;
      
      const payment = await this.getPayment(paymentId);
      if (payment) {
        payment.status = PaymentStatus.PAID;
        payment.updatedAt = new Date();
        await this.savePayment(payment);
        await this.cacheService.delete(`payment:${paymentId}`);
      }
    }
  }

  private async handlePixWebhook(payload: any): Promise<void> {
    const { transactionId, status } = payload;
    
    // Buscar pagamento pelo provider transaction ID
    const payment = await this.findPaymentByProviderTransactionId(transactionId);
    if (payment) {
      payment.status = status === 'paid' ? PaymentStatus.PAID : PaymentStatus.FAILED;
      payment.updatedAt = new Date();
      await this.savePayment(payment);
      await this.cacheService.delete(`payment:${payment.id}`);
    }
  }

  // Métodos de banco de dados (implementar com ORM de sua escolha)
  private async savePayment(payment: Payment): Promise<void> {
    // Implementar persistência no PostgreSQL
    console.log('Saving payment to database:', payment);
  }

  private async findPaymentById(id: string): Promise<Payment | null> {
    // Implementar busca no PostgreSQL
    console.log('Finding payment by ID:', id);
    return null;
  }

  private async findPaymentByProviderTransactionId(transactionId: string): Promise<Payment | null> {
    // Implementar busca no PostgreSQL
    console.log('Finding payment by provider transaction ID:', transactionId);
    return null;
  }
}