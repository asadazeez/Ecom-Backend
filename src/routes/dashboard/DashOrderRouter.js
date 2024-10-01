import express from 'express';
import { getAllOrder } from '../../controllers/dashboard/DashOrderController.js';


export const DashOrderRouter = express.Router();
DashOrderRouter.get('/', getAllOrder);