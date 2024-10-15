import stripePackage from 'stripe';
import { OrderModel } from '../../models/OrderModel.js';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/errorHandler.js';
import env from '../../env.js';

export const OrderDetails = async (req, res, next) => {
  try {
    const stripe = stripePackage(env.STRIPE_SECRET_KEY);
    const { userId } = req.user;
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

    const {
      firstName,
      lastName,
      emailAddress,
      address,
      country,
      pinCode,
      phoneNumber,
    } = billingDetails;

    const order = await OrderModel.create({
      userId: userId,
      items: items,
      total: total,
      shippingTotal: shippingCost,
      grandTotal: grandTotal,
      billingDetails: {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        address: address,
        country: country,
        pinCode: pinCode,
        phoneNumber: phoneNumber,
      },
      deletedAt: null,
    });

    const customer = await stripe.customers.create({
      name: `${firstName} ${lastName}`,
      address: {
        country: billingDetails.country,
        postal_code: billingDetails.pinCode,
        line1: billingDetails.address,
      },
      email: billingDetails.emailAddress,
      phone: billingDetails.phoneNumber,
    });

    const paymentIntents = await stripe.paymentIntents.create({
      amount: grandTotal * 100,
      currency: 'inr',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { orderId: order._id.toString() },
      shipping: {
        name: `${firstName} ${lastName}`,
        address: {
          country: billingDetails.country,
          postal_code: billingDetails.pinCode,
          line1: billingDetails.address,
        },
      },
      receipt_email: emailAddress,
    });

    return res.status(200).json({
      success: true,
      message: 'Order Created Fetched',
      data: {
        amount: grandTotal,
        total: total,
        shippingCost: shippingCost,
        orderId: order._id,
        sessionId: paymentIntents.client_secret,
      },
    });
  } catch (error) {
    next(serverError(error));
  }
};
