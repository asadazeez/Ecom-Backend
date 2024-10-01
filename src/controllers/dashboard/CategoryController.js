import mongoose from 'mongoose';
import { CategoryModel} from '../../models/CategoryModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import dayjs from 'dayjs';
import { getFilePath } from '../../utils/filePath.js';
import { BannerModel } from '../../models/BannerModel.js';
import { ProductModel } from '../../models/ProductModel.js';

export const addCategory = async (req,res,next) => {
    try{
        const {name , description } = req.body;
        if (!name) {
            next(validationError('Name is required'));
        }

        const image = getFilePath(req.file);



        await CategoryModel.create({
            categoryname:name,
            description:description,
            image,
            deleteAt:null
        });
        res.status(200).json({
            success: true,
            message:'Category added successfully'
        });
    }catch(error){
        next(serverError(error));
    }
};
export const getCategoryId = async (req,res,next) => {
    try{
        const {categoryId} = req.params;
        const category = (
            await CategoryModel.aggregate(
                [{
                    $match: {
                        _id: new mongoose.Types.ObjectId(categoryId),
                        deleteAt:null,
                    },
                },
            {
                $project: {
                    categoryname:1,
                    description:1,
                    _id:1,
                    image:1
                },
            },
            ]
            )
        ).at(0);
        if (!category) {
            next(validationError('Category not found'));
        }
        res.status(200).json({
            success:true,
            message:'Category Retrieved successfully',
            data:category,
        });
    }catch(error){
        next(serverError(error));
    }
};
 
export const getCategoryList = async(req,res,next) => {
    try {
        const category = await CategoryModel.aggregate([{
            $match:{
                deletedAt:null,
            },
        },

        {
            $project:{
                name:'$categoryname',
                _id:1,
            },
        },
    ]);
    if (!category) {
        next(validationError('Category not found'));
    }
    res.status(200).json({
        success:true,
        message:'Category Retrieved successfully',
        data:category,
    });
        
    } catch (error) {
        next(serverError(error));
        
    }
};
export const getAllCategory = async (req,res,next) => {
    try{
       
        const category = 
            await CategoryModel.aggregate(
                [{
                    $match: {
                        deletedAt:null,
                    },
                },
                {
                    $sort:{createdAt:-1}
                            },
            {
                $project: {
                    categoryname:1,
                    description:1,
                    _id:1,
                },
            },
            ]
            )
       ;
        if (!category) {
            next(validationError('Category not found'));
        }
        res.status(200).json({
            success:true,
            message:'Category Retrieved successfully',
            data:category,
        });
    }catch(error){
        next(serverError(error));
    }
};

export const updateCategory = async (req,res ,next) => {
    try {
        const {categoryId} = req.params;
        const{name,description} = req.body;

        if (!name){
            res.status(422).json({
                success:false,
                message:'name is required'
            });
        }
        const category = await CategoryModel.findOne({_id:categoryId,deletedAt:null});
        if(!name){
            res.status(422).json({
                success:false,
                message:'Category not found',
            });
        }
        let categoryImage =category.image;
        if(req.file){
            categoryImage = getFilePath(req.file);
        }
        category.categoryname = name;
        category.description = description;
        category.image = categoryImage; 
        await category.save();

        res.status(200).json({
            success:true,
            message:'Category Updated Successfully'
        });

    } 
    catch (error){
        next(serverError(error));

    }
};
export const deleteCategory = async(req , res, next) => {
    try{
        const {categoryId} = req.params;
        const category = await CategoryModel.findOne({_id:categoryId,deletedAt:null});
        
        if(!category){
            res.status(422).json({
                success:false,
                message:'Category not found',

        });
     }
        const banners = await BannerModel.find({category:categoryId,deletedAt:null});
        const products = await ProductModel.find({category:categoryId , deletedAt:null});


        if(banners && banners.length>0){
            res.status(201).json({
                success:false,
                message:'This category cannot be deleted because it is currently being used in a banner. ',

        });
     }
        if(products && products.length>0){
            res.status(201).json({
                success:false,
                message:'This category cannot be deleted because it is currently assigned to one or more products. ',

        });
     }
        
     category.deletedAt = dayjs();
     await category.save();
     res.status(200).json({
        success:true,
        message:'Category deleted Successfully'
    });
    }catch(error){
        next(serverError(error));
    }

};