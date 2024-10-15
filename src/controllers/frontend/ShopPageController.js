import { CategoryModel } from '../../models/CategoryModel.js';
import { validationError } from '../../utils/errorHandler.js';



export const ShopPage = async (req, res, next ) => {
    try {
        const categories = await CategoryModel.aggregate([{

            $match:{
                deletedAt:null,
                
            },
        },
       

        
        {
            $project:{
                name:'$categoryname',
                image:1,
                _id:1,
            },
        },
    ]);
    return res.status(200).json({
        success:true,
        data:{categories:categories}
    });
        
    } catch (error) {
        return next(validationError(error));
        
    }
};