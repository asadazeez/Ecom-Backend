import { ProductModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/errorHandler.js';
import { BrandModel } from '../../models/BrandModel.js';
import mongoose from 'mongoose';
export const SingleProductPage = async (req, res, next) => {
  try {
    const {productId} = req.params;
    const product = (await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          _id:new mongoose.Types.ObjectId(productId),


        },
      },
      {
        $lookup:{
            from:BrandModel.modelName,
            localField:'brand',
            foreignField:'_id',
            pipeline:[
                {
                    $match:{
                        deletedAt:null
                    },

                },
                {
                    $project:{
                        _id:0,
                        brandname:1
                    }
                }
            ],
            as:'brand'
        }
      },
      {
        $unwind: {path:'$brand', preserveNullAndEmptyArrays:true},
      },


     

      {
        $project:{
            name:1,
            price:1,
            image:1,
            description:1,
            brand:'$brand.brandname'

        }
      }
    ])).at(0);

    return res.status(200).json({
        success:true,
        data:{product:product}

    });
  } catch (error) {
    return next(serverError(error));
  }
};
