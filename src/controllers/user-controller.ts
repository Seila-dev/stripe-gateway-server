import { NextFunction, Request, Response } from "express"
import Stripe from "stripe";

import { prisma } from "../database/connection"
import { createStripeCustomer } from "../utils/stripe";

export class UserController {
  async getAll(
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await prisma.user.findMany()
      res.status(200).json(data)
    } catch (e) {
      return next(e)
    }
  }

  async save(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
        const body = req.body
        const customer = await createStripeCustomer({
            email: body.email,
            name: body.name,
        })

        const data = await prisma.user.create({ 
            data: { ...body, stripeCostumerId: customer.id }
        })
        res.status(200).json(data)
    } catch (e) {
        return next(e)
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
        const id = req.params.id
        const data = await prisma.user.findFirst({ where: { id } })
        res.status(200).json(data)
    } catch (e) {
        return next(e)
    }
  }

}
