import  express from 'express';
import { HomePageRouter } from '../HomePageRouter.js';
import { ShopPageRouter } from '../ShopPageRouter.js';
import { ProductPageRouter } from '../ProductPageRouter.js';
import { SingleProductRouter } from '../SingleProductRouter.js';
import { UserRouter } from '../UserRouter.js';
import { OrderRouter } from '../OrderRouter.js';
import { CarouselRouter } from '../CarouselRouter.js';
import { GetAllProductsRouter } from '../GetAllProductsRouter.js';


export const frontendRoutes  = express.Router();

frontendRoutes.use('/home-page',HomePageRouter);
frontendRoutes.use('/shop-page',ShopPageRouter);
frontendRoutes.use('/product-page',ProductPageRouter);
frontendRoutes.use('/single-product',SingleProductRouter);
frontendRoutes.use('/user',UserRouter);
frontendRoutes.use('/order',OrderRouter);
frontendRoutes.use('/carousel',CarouselRouter);
frontendRoutes.use('/get-all',GetAllProductsRouter);