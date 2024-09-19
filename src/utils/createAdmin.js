import env from '../env.js';
import { AdminModel } from '../models/AdminModel.js';
import   bcrypt from 'bcrypt';
import { serverError } from './errorHandler.js';

export const createAdmin  = async(next) => {
    try {
        const admin = await AdminModel.findOne({});
        if (admin){
            return;
        }
        
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, salt);
        
            await AdminModel.create({
              email: env.ADMIN_EMAIL,
              password: hash,
              deletedAt: null,
            });
            return;
        }
        
    } catch (error) {
        next(serverError(error));
        
        
    }

};