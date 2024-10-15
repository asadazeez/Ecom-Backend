import mongoose from 'mongoose';
import { ProductModel } from '../../models/ProductModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import dayjs from 'dayjs';
import { BrandModel } from '../../models/BrandModel.js';
import { CategoryModel } from '../../models/CategoryModel.js';
import { getFilePath } from '../../utils/filePath.js';

export const addProduct = async (req, res, next) => {

  try {
    const { name, description, brands, price, category } = req.body;
    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'name is mandatory',
      });
    }
    const image = getFilePath(req.file);

    await ProductModel.create({
      name,
      description,
      price,
      brand: brands,
      image,
      category,
      deletedAt: null,
    });

    return  res.status(201).json({
      success: true,
      message: 'Product added successfully',
    });
  } catch (error) {
    return  next(serverError(error));
  }
};

export const getProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = (
      await ProductModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
            deletedAt: null,  // Fixed typo here
          },
        },
        {
          $lookup: {
            from: BrandModel.modelName,
            localField: 'brand',
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
                  brandname: 1,
                },
              },
            ],
            as: 'brandDetails',
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
            as: 'categoryDetails',
          },
        },
        {
          $unwind: {path:'$brandDetails', preserveNullAndEmptyArrays:true},
        },
        {
          $unwind: {path:'$categoryDetails', preserveNullAndEmptyArrays:true},
        },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            brand: 1,
            category: 1,
            image:1,
            brandName: '$brandDetails.brandname',
          categoryName: '$categoryDetails.categoryname'
          },
        },
      ])
    ).at(0);

    if (!product) {
      return next(validationError('Product not found'));
    }

    return  res.status(200).json({
      success: true,
      message: 'Product Retrieved successfully',
      data: product,
    });
  } catch (error) {
    return  next(serverError(error));
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
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
          from: BrandModel.modelName,
          localField: 'brand',
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
        $unwind: {path:'$brand', preserveNullAndEmptyArrays:true},
      },
      {
        $unwind: {path:'$category', preserveNullAndEmptyArrays:true},
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          brand: '$brand.brandname',
          category: '$category.categoryname', 
          featured:1,
          image:1
        },
      },
    ]);

    return  res.status(200).json({
      success: true,
      message: 'Products Retrieved successfully',
      data: products,
    });
  } catch (error) {
    return  next(serverError(error));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, price, brand, category } = req.body;

    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'name is mandatory',
      });
    }

    const product = await ProductModel.findOne({
      _id: productId,
      deletedAt: null,
    });

    if (!product) {
      return res.status(422).json({
        success: false,
        message: 'Product not found',
      });
    }
let  productImage = product.image;
if(req.file){
  productImage = getFilePath(req.file);
}
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.price = price;
    product.category = category;
    product.image = productImage;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product Updated Successfully',
    });
  } catch (error) {
    return  next(serverError(error));
  }
};

export const featuredProduct = async (req , res, next) => {
    try {
        const {productId} = req.params;
        const product = await ProductModel.findOne({_id:productId});
        if (!product) {
            return res.status(422).json({
              success: false,
              message: 'Product not found',
            });
          }
          product.featured = product.featured===true?false:true;
          await product.save();

          return  res.status(200).json({
            success: true,
            message: product.featured?'Product is Featured':' Product is not featured',
          });
        
    } catch (error) {
      return  next(serverError(error));
        
    }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return res.status(422).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.deletedAt = dayjs().toDate();
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product deleted Successfully',
    });
    
  } catch (error) {
    return  next(serverError(error));
  }
};
