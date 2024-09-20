import express from 'express';
import { BrandRouter } from '../BrandRouter.js';
import { CategoryRouter } from '../CategoryRouter.js';
import { ProductRouter } from '../ProductRouter.js';
import { AdminRouter } from '../AdminRouter.js';
import { BannerRouter } from '../BannerRouter.js';
import { DashHomePageRouter } from '../DashHomePageRouter.js';
// import { adminAuthMiddleware } from '../../../middleware/AdminAuthMiddleware.js';

export const dashboardRoutes = express.Router();
dashboardRoutes.use('/brands',BrandRouter);
dashboardRoutes.use('/categories',CategoryRouter);
dashboardRoutes.use('/products',ProductRouter);
dashboardRoutes.use('/admin',AdminRouter);
dashboardRoutes.use('/banners',BannerRouter);
dashboardRoutes.use('/dash-home-page',DashHomePageRouter);