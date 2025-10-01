import { Router } from 'express';
import { getAllProducts } from '../controllers/products.controller';

const router = Router();

router.get('/get-all', getAllProducts);

export default router;
