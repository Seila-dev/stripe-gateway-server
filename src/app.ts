import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PaymentService } from './services/PaymentService';
import { StripeService } from './services/StripeService';
import { CacheService } from './services/CacheService';
import { IdempotencyService } from './services/IdempotencyService';
import { PaymentController } from './controllers/PaymentController';
import { WebhookController } from './controllers/WebhookController';
import { createPaymentRoutes } from './routes/PaymentRoutes';
import { createWebhookRoutes } from './routes/Webhooks';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import checkoutRoutes from './routes/checkout-session.routes';

export class App {
  public app: express.Application;
  private paymentService!: PaymentService;
  private paymentController!: PaymentController;
  private webhookController!: WebhookController;

  constructor() {
    this.app = express();
    this.initializeServices();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeServices(): void {
    // Inicializar serviços
    const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);
    const cacheService = new CacheService(process.env.REDIS_URL!);
    const idempotencyService = new IdempotencyService(cacheService);
    
    this.paymentService = new PaymentService(
      stripeService,
      null as any, // PixService - implementar conforme PSP escolhido
      cacheService,
      idempotencyService
    );

    // Inicializar controllers
    this.paymentController = new PaymentController(this.paymentService);
    this.webhookController = new WebhookController(this.paymentService, stripeService);
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por IP por janela de tempo
      message: 'Too many requests from this IP'
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api', createPaymentRoutes(this.paymentController));
    this.app.use('/api', createWebhookRoutes(this.webhookController));
    this.app.use('/checkout', checkoutRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }
}