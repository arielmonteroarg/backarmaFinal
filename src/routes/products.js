import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/checkAuth.js';

const router = Router();
const controller = new ProductController();

/* ===== API REST ===== */
router.get('/',        controller.getProducts);
router.get('/:id',     controller.getProductById);
router.post('/',       isAuthenticated, isAdmin, controller.createProduct);
router.put('/:id',     isAuthenticated, controller.updateProduct);
router.delete('/:id',  isAuthenticated, isAdmin, controller.deleteProduct);

export default router;

