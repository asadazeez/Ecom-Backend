import { OrderModel } from '../../models/OrderModel.js';
import { userModel } from '../../models/UserModel.js';
import { serverError } from '../../utils/errorHandler.js';

export const getAllOrder = async (req, res, next) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: userModel.modelName,
          localField: 'userId',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                deletedAt: null,
              },
            },
            {
              $project: {
                _id: 0,
                name: 1,
              },
            },
          ],
          as:'userId'
        },
      },
      {
        $unwind: {path:'$userId', preserveNullAndEmptyArrays:true},
      },

      {
        $project: {
          userId: '$userId.name',
          orderNumber: 1,
          total: 1,
          grandTotal: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {orders:orders},
    });
  } catch (error) {
    next(serverError(error));
  }
};
