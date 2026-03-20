import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';

const router = Router();

router.get('/', ProductsController.list);
router.get('/:identifier', ProductsController.detail);

export default router;
