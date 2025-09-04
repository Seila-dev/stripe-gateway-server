import { Request, Response } from "express"
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil', // Use a versão mais recente disponível
});

// import { prisma } from "../../prisma/prisma"
const YOUR_DOMAIN = 'http://localhost:3000'; //frontend domain

export class CreateCheckoutSession {
  async create(req: Request, res: Response) {
    try {
      const { quantity = 1 } = req.body;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            price: 'price_1S3HfePIinTm7LazuMMpGIsV',
            quantity,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/canceled`,
      });

      res.status(200).json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({
        error: 'Erro ao criar sessão de checkout',
        details: error.message,
      });
    }
  }

}
