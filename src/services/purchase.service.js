import mongoose from 'mongoose';
import Cart from '../daos/mongo/models/Cart.js';
import Ticket from '../daos/mongo/models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';
import { sendPurchaseMail } from '../utils/email.js';
import User from '../daos/mongo/models/User.js'; // <-- Asegúrate de tenerlo

export default class PurchaseService {
  static async finalizePurchase(cartId) {
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart || cart.products.length === 0) {
      throw new Error('Carrito vacío o no encontrado');
    }

    // Obtenemos el usuario (asegúrate de que Cart tenga el campo userId)
    const user = await User.findById(cart.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    let totalAmount = 0;
    let totalQuantity = 0;
    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;
        totalQuantity += item.quantity;
        purchasedProducts.push(item);
      }
    }

    if (purchasedProducts.length === 0) {
      throw new Error('No hay productos con stock suficiente');
    }

    // Removemos los productos comprados del carrito
    cart.products = cart.products.filter(item =>
      !purchasedProducts.some(p => p.product._id.equals(item.product._id))
    );
    await cart.save();

    const ticket = await Ticket.create({
      code: uuidv4(),
      amount: totalAmount,
      quantity: totalQuantity,
      purchaser: user.email,
    });

    await sendPurchaseMail({ to: user.email, ticket });

    return ticket;
  }
}