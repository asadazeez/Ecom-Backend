import express from 'express';
import { addBrand, deleteBrand, getAllBrand, getBrandId, getBrandList, updateBrand } from '../../controllers/dashboard/BrandController.js';
import { uploadImageFile } from '../../utils/fileUploader.js';


export const BrandRouter = express.Router();
BrandRouter.get('/brandlist',getBrandList);
BrandRouter.get('/allbrands',getAllBrand);
BrandRouter.get('/:brandId',getBrandId);
BrandRouter.post('/',uploadImageFile('brands').single('imageFile'),addBrand);
BrandRouter.put('/:brandId',uploadImageFile('brands').single('imageFile'),updateBrand);
BrandRouter.delete('/:brandId',deleteBrand);