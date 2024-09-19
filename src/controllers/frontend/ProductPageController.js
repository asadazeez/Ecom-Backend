import mongoose from 'mongoose';
import { CategoryModel } from '../../models/CategoryModel.js';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/errorHandler.js';

export const ProductByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          category: new mongoose.Types.ObjectId(categoryId),
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
                _id: 0,
                categoryname: 1,
                description: 1,
              },
            },
          ],
          as: 'category',
        },
      },

      {
        $unwind: {path:'$category', preserveNullAndEmptyArrays:true},
      },

      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          category: 1,
        },
      },
    ]);

    

    res.status(200).json({
      success: true,
      data: { products: products, categoryData: products?.at(0)?.category },
    });
  } catch (error) {
    next(serverError(error));
  }
};
