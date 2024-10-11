import express from 'express';
import { getAllOrder, OrderStatus, OrderView } from '../../controllers/dashboard/DashOrderController.js';


export const DashOrderRouter = express.Router();
DashOrderRouter.get('/', getAllOrder);
DashOrderRouter.get('/status', OrderStatus);
DashOrderRouter.get('/order-view/:orderId', OrderView);