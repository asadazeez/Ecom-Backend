import express from 'express';
import { OrderDetails } from '../../controllers/frontend/OrderController.js';


export const OrderRouter = express.Router();
OrderRouter.post('/:userId' ,OrderDetails );