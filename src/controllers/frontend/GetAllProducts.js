import { BrandModel } from '../../models/BrandModel.js';
import { CategoryModel } from '../../models/CategoryModel.js';

import { ProductModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/errorHandler.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: BrandModel.modelName,
          localField: 'brand',
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
                brandname: 1,
              },
            },
          ],
          as: 'brand',
        },
      },
      {
        $lookup: {
          from: CategoryModel.modelName,
          localField: 'category',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                deletedAt: null, // Fixed typo here
              },
            },
            {
              $project: {
                _id: 0,
                categoryname: 1,
              },
            },
          ],
          as: 'category',
        },
      },
      {
        $unwind: { path: '$brand', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          brand: '$brand.brandname',
          category: 1,
          featured: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Products Retrieved successfully',
      data: products,
    });
  } catch (error) {
    return next(serverError(error));
  }
};
