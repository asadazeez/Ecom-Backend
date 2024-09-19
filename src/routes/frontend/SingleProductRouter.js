import express from 'express';
import { SingleProductPage } from '../../controllers/frontend/SingleProductController.js';


export const SingleProductRouter = express.Router();
SingleProductRouter.get('/:productId',SingleProductPage);
