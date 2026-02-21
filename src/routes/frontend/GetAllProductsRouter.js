import express from 'express';
import { getAllProducts } from '../../controllers/frontend/GetAllProducts.js';

export const GetAllProductsRouter = express.Router();
GetAllProductsRouter.get('/', getAllProducts);
