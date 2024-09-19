import express from 'express';
import { ShopPage } from '../../controllers/frontend/ShopPageController.js';

export const ShopPageRouter = express.Router();
ShopPageRouter.get('/',ShopPage);