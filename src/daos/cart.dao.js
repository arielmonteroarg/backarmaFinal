import Cart from './mongo/models/Cart.js';

export default class CartDAO {
  async findByUserId(userId) {
    return await Cart.findOne({ userId }).populate('products.product').lean();
  }

  async create(userId) {
    return await Cart.create({ userId, products: [] });
  }

  async addProduct(userId, productId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await this.create(userId);

    const existing = cart.products.find(p => p.product.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
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
    return cart;
  }

  async removeProduct(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async clear(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
  }
}