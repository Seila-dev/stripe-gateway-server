import { Payment } from "../types/paymentTypes";
import { CacheService } from "./CacheService";

export class IdempotencyService {
  constructor(private cacheService: CacheService) {}

  async getPayment(idempotencyKey: string): Promise<Payment | null> {
    return await this.cacheService.get(`idempotency:${idempotencyKey}`);
  }

  async savePayment(idempotencyKey: string, payment: Payment): Promise<void> {
    await this.cacheService.set(`idempotency:${idempotencyKey}`, payment, 86400); // 24 horas
  }
}