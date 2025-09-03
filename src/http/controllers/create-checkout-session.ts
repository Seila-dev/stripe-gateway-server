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
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            price_data: {
              currency: 'brl',
              unit_amount: 7999, // R$50,00
              product_data: {
                name: 'Produto nome'
              }
            },
            quantity: 10,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });

      res.redirect(303, session.url as string);
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
    }
  }

}
