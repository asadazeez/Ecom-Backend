import express from 'express';
import { Banner } from '../../controllers/frontend/BannerController.js';


export const CarouselRouter = express.Router();
CarouselRouter.get('/',Banner);