import express from 'express';
import { OrderDetails } from '../../controllers/frontend/OrderController.js';
import { userAuthMiddleware } from '../../middleware/UserAuthMiddleware.js';

export const OrderRouter = express.Router();
OrderRouter.post('/', userAuthMiddleware, OrderDetails);
