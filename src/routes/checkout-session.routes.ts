import { CreateCheckoutSession } from '../controllers/create-checkout-session';
// import { authMiddleware } from '../middlewares/auth';
import { Router } from 'express';

const checkoutRoutes = Router();

checkoutRoutes.post(
    '/create-checkout-session', 
    // authMiddleware, 
    new CreateCheckoutSession().create
)


export default checkoutRoutes;
