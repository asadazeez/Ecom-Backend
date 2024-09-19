import express from 'express';
import { HomePage } from '../../controllers/frontend/HomePageController.js';



export const HomePageRouter = express.Router();
HomePageRouter.get('/', HomePage);
