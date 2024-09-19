import express from 'express';
import { AdminLogin, NewAdmin, UpdatePassword } from '../../controllers/dashboard/AuthController.js';

export const AdminRouter = express.Router();
AdminRouter.post('/login',AdminLogin);
AdminRouter.post('/',NewAdmin);
AdminRouter.post('/update', UpdatePassword);