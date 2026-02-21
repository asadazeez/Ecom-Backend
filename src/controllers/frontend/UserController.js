import jwt from 'jsonwebtoken';
import env from '../../env.js';
import { userModel } from '../../models/UserModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import bcrypt from 'bcrypt';

export const NewUser = async (req , res , next) => {
    try {
        const { email, password , name  , confirmPassword} = req.body;

        if (password != confirmPassword) {
            return res.status(404).json({
              success: false,
              message: 'Password  And Confirm Password Are Not Same',
            });
          }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        await userModel.create({
            email:email,
            password:hash,
            name:name,
            deletedAt:null

        });
        return res.status(200).json({
            success: true,
            message: 'SignUp Successfully',
          });


    } catch (error) {
        return next(serverError(error));
        
    }
};





export const UserLogin = async(req,res,next) => {
    try {
        const { email, password } = req.body;
        if (!email && password) {
            next(validationError('Required'));
          }
          const user = await userModel.findOne({email:email});
          if (!user) {
            return res.status(200).json({
              success: false,
              message: 'User not found',
            });
          }
          const checkPassword = bcrypt.compareSync(password , user.password);
    if (!checkPassword) {
        return res.status(404).json({
          success: false,
          message: 'Authentication Failed . Invalid Password ',
        });
      }

      const accessToken = jwt.sign({userId: user._id},env.USER_JWT_SECRET_KEY );
      const userData = {email:user.email , role:'user',accessToken,userId:user._id};
      res.status(200).json({
        success: true,
        message:'Login Successfully',
        userData,

      });

      
        
    } catch (error) {
        next(serverError(error));
        
    }
};