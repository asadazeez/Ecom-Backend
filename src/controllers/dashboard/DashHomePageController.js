import { CategoryModel } from '../../models/CategoryModel.js';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';

export const DashHomePage = async (req, res, next) => {
  try {
    const category = await CategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },

      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 7,
      },
      {
        $project: {
          name: '$categoryname',
          image: 1,
          _id: 1,
        },
      },
    ]);

    if (!category) {
      next(validationError('Category not found'));
    }

    const featured = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          featured: true,
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          price: 1,
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: { categories: category, featured: featured },
    });
  } catch (error) {
    next(serverError(error));
  }
};
