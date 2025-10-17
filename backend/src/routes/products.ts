import { Router } from 'express';
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct
} from '../controllers/products.controller';
import upload from '../middleware/upload.middleware';

const router = Router();


router.get('/get-all', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);


export default router;
