import env from '../../env.js';
import { AdminModel } from '../../models/AdminModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const NewAdmin = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, salt);

    await AdminModel.create({
      email: env.ADMIN_EMAIL,
      password: hash,
      deletedAt: null,
    });
    res.status(200).json({
      success: true,
      message: 'Login Successfully',
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const UpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return next(validationError('User not found'));
    }
    const IsPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    const IsPasswordSame = bcrypt.compareSync(newPassword, user.password);

    if (!IsPasswordValid) {
      // return next(validationError('Old password is incorrect!'));
      return res.status(201).json({
        success: false,
        message: 'Old password is incorrect!',
      });
    }

    if (IsPasswordSame) {
      // return next(validationError('Old Password  And New Password Cannot Be Same '));
      return res.status(201).json({
        success: false,
        message: 'Old Password  And New Password Cannot Be Same ',
      });
    }

    if (newPassword !== confirmPassword) {
      // return next(validationError('New Password  And Confirm Password Are Not Same'));
      return res.status(201).json({
        success: false,
        message: 'New Password  And Confirm Password Are Not Same ',
      });
    }

    //  generate a new hash for the password
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    // update the  user's password
    user.password = newHash;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password Updated Successfully',
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const AdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && password) {
      next(validationError('Required'));
    }

    const user = await AdminModel.findOne({ email: email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found',
      });
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.status(201).json({
        success: false,
        message: 'Authentication Failed . Invalid Password ',
      });
    }

    const accessToken = jwt.sign(
      { adminId: user._id },
      env.ADMIN_JWT_SECRET_KEY
    );
    const userData = { email: user.email, role: 'admin' };

    res.status(200).json({
      success: true,
      message: 'Login Successfully',
      accessToken,
      userData,
    });
  } catch (error) {
    next(serverError(error));
  }
};

export const ValidateToken = async (req, res, next) => {
  try {
    ('');
  } catch (error) {
    return next(serverError(error));
  }
};
