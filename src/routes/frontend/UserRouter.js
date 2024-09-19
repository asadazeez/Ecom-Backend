import express from 'express';
import { NewUser, UserLogin } from '../../controllers/frontend/UserController.js';


export const UserRouter = express.Router();
UserRouter.post('/',NewUser);
UserRouter.post('/login',UserLogin);
