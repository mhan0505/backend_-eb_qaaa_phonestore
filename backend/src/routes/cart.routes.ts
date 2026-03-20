import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.patch('/items/:variantId', CartController.updateItem);
router.delete('/items/:variantId', CartController.removeItem);

export default router;
