import express from 'express';
import { ProductByCategory } from '../../controllers/frontend/ProductPageController.js';

export const ProductPageRouter = express.Router();
ProductPageRouter.get('/:categoryId',ProductByCategory);
