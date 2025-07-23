import { Router } from 'express';
import {
  getCart,
  addProductToCart,
  increaseQuantity,
  decreaseQuantity,
  removeProduct,
  clearCart
} from '../controllers/cart.controller.js';

import { isAuthenticated } from '../middlewares/checkAuth.js';

const router = Router();

router.get('/', isAuthenticated, getCart);
router.post('/agregar/:pid', isAuthenticated, addProductToCart);
router.post('/aumentar/:pid', isAuthenticated, increaseQuantity);
router.post('/disminuir/:pid', isAuthenticated, decreaseQuantity);
router.delete('/eliminar/:pid', isAuthenticated, removeProduct);
router.post('/vaciar', isAuthenticated, clearCart);

export default router;
