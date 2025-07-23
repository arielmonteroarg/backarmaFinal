import CartService from '../services/cart.service.js';
import { CartDTO } from '../dtos/cart.dto.js';

const cartService = new CartService();

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cart, total } = await cartService.getCartWithTotal(userId);
    res.status(200).json({ cart: new CartDTO(cart), total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.pid;
    const updatedCart = await cartService.addProduct(userId, productId);
    res.status(200).json({
      message: 'Producto agregado al carrito',
      cart: new CartDTO(updatedCart)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.pid;
    await cartService.updateQuantity(userId, productId, 1);
    res.status(200).json({ mensaje: 'Cantidad aumentada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.pid;
    await cartService.updateQuantity(userId, productId, -1);
    res.status(200).json({ mensaje: 'Cantidad disminuida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.pid;
    await cartService.removeProduct(userId, productId);
    res.status(200).json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await cartService.clearCart(userId);
    res.status(200).json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
