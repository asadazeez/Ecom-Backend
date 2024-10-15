import mongoose from 'mongoose';
import { OrderModel } from '../../models/OrderModel.js';
import { userModel } from '../../models/UserModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import { ProductModel } from '../../models/ProductModel.js';

export const getAllOrder = async (req, res, next) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
          $sort:{createdAt:-1}
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
          as: 'userId',
        },
      },
      {
        $unwind: { path: '$userId', preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          userId: '$userId.name',
          orderNumber: 1,
          total: 1,
          grandTotal: 1,
          _id: 1,
          orderStatus: 1,
        },
      },
    ]);

    return  res.status(200).json({
      success: true,
      data: { orders: orders },
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const OrderStatus = async (req, res, next) => {
  try {
    const OrderId = req.query.orderId;
    const StatusValue = req.query.orderValue;
    const order = await OrderModel.findOne({
      _id: OrderId,
    });
    if (!order) {
      return res.status(422).json({
        success: false,
        message: 'Order not found',
      });
    }
    order.orderStatus = StatusValue;
    await order.save();

    return  res.status(200).json({
      success: true,
      message: 'Order Status Updated ',
    });
  } catch (error) {
    return  next(serverError(error));
  }
};

export const OrderView = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = (await OrderModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: ProductModel.modelName,
          localField: 'items.productId',
          foreignField: '_id',
          pipeline: [
            
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'productDetails',
        },
      },
      {
        $project: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                productId: '$$item.productId',
                quantity: '$$item.quantity',
                price: '$$item.price',
                productName: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$productDetails',
                        as: 'product',
                        cond: { $eq: ['$$product._id', '$$item.productId'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
          total: 1,
          grandTotal: 1,
          shippingTotal: 1,
          billingDetails:1,
          orderNumber:1,
          createdAt:1
        },
      },
      
    ])).at(0);


    if (!order) {
      return next(validationError('Order not found'));
    }

    return res.status(200).json({
      success: true,
      message: 'Order Retrieved successfully',
      data: order,
    });
  } catch (error) {
    return next(serverError(error));
  }
};
