import CartRepository from '../repositories/cart.repository.js';

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCartWithTotal(userId) {
    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart) {
      return { cart: { products: [] }, total: 0 };
    }

    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    return { cart, total };
  }

  async addProduct(userId, productId) {
    return await this.cartRepository.addProduct(userId, productId);
  }

  async updateQuantity(userId, productId, delta) {
    return await this.cartRepository.updateQuantity(userId, productId, delta);
  }

  async removeProduct(userId, productId) {
    return await this.cartRepository.removeProduct(userId, productId);
  }

  async clearCart(userId) {
    return await this.cartRepository.clearCart(userId);
  }
}

export default CartService;
