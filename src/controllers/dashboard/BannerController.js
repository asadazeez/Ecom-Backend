import dayjs from 'dayjs';
import { BannerModel } from '../../models/BannerModel.js';
import { CategoryModel } from '../../models/CategoryModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import { getFilePath } from '../../utils/filePath.js';
import mongoose from 'mongoose';

export const addBanner = async (req, res, next) => {

    try {
      const {  category } = req.body;
     
      const image = getFilePath(req.file);
  
      await BannerModel.create({
       image,
        category,
        deletedAt: null,
      });
  
      res.status(201).json({
        success: true,
        message: 'Banner added successfully',
      });
    } catch (error) {
      next(serverError(error));
    }
  };

  export const updateBanner = async (req, res, next) => {
    try {

       
      const { bannerId } = req.params;
      const { category } = req.body;
  
      
  
      const banner = await BannerModel.findOne({
        _id: bannerId,
        deletedAt: null,
      });
  
      if (!banner) {
        return res.status(422).json({
          success: false,
          message: 'Banner not found',
        });
      }
  let  bannerImage = banner.image;
  if(req.file){
    bannerImage = getFilePath(req.file);
  }
     
      banner.category = category;
      banner.image = bannerImage;
      await banner.save();
  
      res.status(200).json({
        success: true,
        message: 'Banner Updated Successfully',
      });
    } catch (error) {
      next(serverError(error));
    }
  };

  export const getBannerId = async (req, res, next) => {
    try {
      const { bannerId } = req.params;
  
      const banner = (
        await BannerModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(bannerId),
              deletedAt: null, 
            },
          },
          {
            $project: {
              
              category: 1,
              image:1
            },
          },
        ])
      ).at(0);
  
      if (!banner) {
        return next(validationError('Banner not found'));
      }
  
      res.status(200).json({
        success: true,
        message: 'Banner Retrieved successfully',
        data: banner,
      });
    } catch (error) {
      next(serverError(error));
    }
  };
  


  export const getAllBanner = async (req, res, next) => {
    try {
      const banners = await BannerModel.aggregate([
        {
          $match: {
            deletedAt: null,
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
          $unwind: {path:'$category', preserveNullAndEmptyArrays:true},
        },
        {
          $project: {  
            category: '$category.categoryname',
            image:1 
          },
        },
      ]);
  
      res.status(200).json({
        success: true,
        message: 'Banners Retrieved successfully',
        data: banners,
      });
    } catch (error) {
      next(serverError(error));
    }
  };
  
  export const deleteBanner = async (req, res, next) => {
    try {
      const { bannerId } = req.params;
      const banner = await BannerModel.findOne({ _id: bannerId });
  
      if (!banner) {
        return res.status(422).json({
          success: false,
          message: 'Banner not found',
        });
      }
  
      banner.deletedAt = dayjs().toDate();
      await banner.save();
  
      res.status(200).json({
        success: true,
        message: 'Banner deleted Successfully',
      });
      
    } catch (error) {
      next(serverError(error));
    }
  };
  
  