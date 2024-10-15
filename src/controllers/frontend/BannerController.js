import { serverError } from '../../utils/errorHandler.js';
import { BannerModel } from '../../models/BannerModel.js';

export const Banner = async (req, res, next) => {
  try {
    const carousel = await BannerModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
$project:{
    image:1,
    _id:1,
    category:1

}


      }
    ]);

    return res.status(200).json({
    success:true,
    data:{carousel:carousel}

});


    
  } catch (error) {
    return next(serverError(error));
  }
};
