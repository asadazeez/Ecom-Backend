import express from 'express';
import { ProductByCategoryDash } from '../../controllers/dashboard/ProductbyCategoryController.js';


export const ProductByCategoryRouter =express.Router();
ProductByCategoryRouter.get('/:categoryId',ProductByCategoryDash);