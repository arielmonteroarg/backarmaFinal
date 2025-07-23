import Cart from '../daos/mongo/models/Cart.js';
import { CartDTO } from '../dtos/cart.dto.js';

class CartRepository {
  async getCartByUserId(userId) {
    if (!userId) throw new Error('Falta userId');
    const cart = await Cart.findOne({ userId }).populate('products.product').lean();
    return cart ? new CartDTO(cart) : null;
  }

  async createCart(userId) {
    const newCart = await Cart.create({ userId, products: [] });
    return new CartDTO(newCart);
  }

  async addProduct(userId, productId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await this.createCart(userId);

    const existing = cart.products.find(p => p.product.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return await this.getCartByUserId(userId);
  }

  async updateQuantity(userId, productId, delta) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    const product = cart.products.find(p => p.product.toString() === productId);
    if (!product) throw new Error('Producto no encontrado');

    product.quantity += delta;

    if (product.quantity <= 0) {
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
    }

    await cart.save();
    return await this.getCartByUserId(userId);
  }

  async removeProduct(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return await this.getCartByUserId(userId);
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
  }
}

export default CartRepository;
