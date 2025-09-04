import { Request, Response, NextFunction } from 'express';

export const idempotencyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  if (req.method === 'POST' && !idempotencyKey) {
    res.status(400).json({
      success: false,
      error: 'X-Idempotency-Key header is required for POST requests'
    });
    return;
  }

  next();
};