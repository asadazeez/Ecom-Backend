import jwt from 'jsonwebtoken';
import env from '../env.js';

export  const adminAuthMiddleware = async (req,res,next) => {
    const authHeader = req.headers.Authorization;

    if (!authHeader) {
        res.status(422).json({
            success: false,
            message: 'Access Token Not Found'
        
         });
        }
    try {
      const token = authHeader.split(' ')[1];
      const decodeData = jwt.verify(token,env.ADMIN_JWT_SECRET_KEY);
      if(!decodeData){
        res.status(422).json({
            success: false,
            message: 'Access Token Expired'
        
         });

      }
      req.user = decodeData;
      next();

        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Access Token Expired'
        });
        
    }
};