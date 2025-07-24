import CartDAO from '../daos/cart.dao.js';
import { CartDTO } from '../dtos/cart.dto.js';

class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }

  async getCartByUserId(userId) {
    if (!userId) throw new Error('Falta userId');
    const cart = await this.dao.findByUserId(userId);
    return cart ? new CartDTO(cart) : null;
  }

  async createCart(userId) {
    const cart = await this.dao.create(userId);
    return new CartDTO(cart);
  }

  async addProduct(userId, productId) {
    await this.dao.addProduct(userId, productId);
    return await this.getCartByUserId(userId);
  }

  async updateQuantity(userId, productId, delta) {
    await this.dao.updateQuantity(userId, productId, delta);
    return await this.getCartByUserId(userId);
  }

  async removeProduct(userId, productId) {
    await this.dao.removeProduct(userId, productId);
    return await this.getCartByUserId(userId);
  }

  async clearCart(userId) {
    await this.dao.clear(userId);
  }
}

export default CartRepository;