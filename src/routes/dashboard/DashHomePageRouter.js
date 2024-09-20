import express from 'express';
import { DashHomePage } from '../../controllers/dashboard/DashHomePageController.js';



export const DashHomePageRouter = express.Router();
DashHomePageRouter.get('/', DashHomePage);
