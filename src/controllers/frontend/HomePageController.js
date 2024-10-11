import { CategoryModel } from '../../models/CategoryModel.js';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';

export const HomePage = async (req, res, next) => {
  try {
    const category = await CategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $limit: 4,
      },
      {
        $sort: { createdAt:1 },
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
        $lookup: {
          from: CategoryModel.modelName,
          localField: 'category',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                deletedAt: null,
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: 'category',
        },
      },{
        $unwind: {path:'$category', preserveNullAndEmptyArrays:true},

      },
      
      {
        $project: {
          name: 1,
          image: 1,
          price: 1,
          _id: 1,
          category:1
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
