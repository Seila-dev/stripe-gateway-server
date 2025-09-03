import { CreateCheckoutSession } from '../http/controllers/create-checkout-session';
// import { authMiddleware } from '../middlewares/auth';
import { Router } from 'express';

const productsRoutes = Router();

productsRoutes.post(
    '/create-checkout-session', 
    // authMiddleware, 
    new CreateCheckoutSession().create
)


export default productsRoutes;
