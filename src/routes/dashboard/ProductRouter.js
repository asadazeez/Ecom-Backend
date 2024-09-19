import express from 'express';
import { addProduct, deleteProduct, featuredProduct, getAllProduct, getProductId, updateProduct } from '../../controllers/dashboard/ProductController.js';
import { uploadImageFile } from '../../utils/fileUploader.js';

export const ProductRouter = express.Router();
ProductRouter.delete('/:productId',deleteProduct);
ProductRouter.get('/allproducts',getAllProduct);
ProductRouter.post('/',uploadImageFile('products').single('imageFile'),addProduct);
ProductRouter.get('/:productId',getProductId);
ProductRouter.put('/:productId',uploadImageFile('products').single('imageFile'),updateProduct);
ProductRouter.post('/featured/:productId',featuredProduct);
