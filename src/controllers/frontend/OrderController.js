import { OrderModel } from '../../models/OrderModel.js';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/errorHandler.js';

export const OrderDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { billingDetails, cartItems } = req.body;

    const shippingCost = 20;

    if (!cartItems) {
      return res.status(201).json({
        success: false,
        message: 'Cart Is Empty',
        data: {},
      });
    }
    const productIds = cartItems.map((item) => item.id);
    const matchedProducts = [];
    for (const productId of productIds) {
      const products = await ProductModel.find({ _id: productId }).lean();
      matchedProducts.push(...products);
    }

    if (matchedProducts.length !== cartItems.length) {
      return res.status(201).json({
        success: false,
        message: 'All product not found',
        data: {},
      });
    }
    let total = 0;

    cartItems.map((cartItem) => {
      const price = matchedProducts.find(
        (item) => item._id.toString() === cartItem._id.toString()
      )?.price;
      total = total + cartItem.quantity * price;
    });
    const grandTotal = total + shippingCost;

    const items = [];





    
    cartItems.map((cartItem) => {
      items.push({
        productId: cartItem._id,
        quantity: cartItem.quantity,
        price: cartItem.price,
      });
    });

    const order = await OrderModel.create({
      userId: userId,
      items: items,
      total: total,
      shippingTotal: shippingCost,
      grandTotal: grandTotal,
      billingDetails: {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        emailAddress: billingDetails.emailAddress,
        address: billingDetails.address,
        country: billingDetails.country,
        pinCode: billingDetails.pinCode,
        phoneNumber: billingDetails.phoneNumber,
      },
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Order Created Fetched',
      data: {
        amount: grandTotal,
        total: total,
        shippingCost: shippingCost,
        orderId: order._id,
      },
    });
  } catch (error) {
    next(serverError(error));
  }
};
