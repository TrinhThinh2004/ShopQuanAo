import { Router } from 'express';
import { getAllProducts } from '../controllers/products.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public route - ai cũng xem được sản phẩm
router.get('/get-all', getAllProducts);



export default router;
