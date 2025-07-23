export class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;
    this.userId = cart.userId;
    this.products = cart.products.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
  }
}

export class CartItemDTO {
  constructor(item) {
    this.productId = item.product._id || item.product;
    this.quantity = item.quantity;
    this.title = item.product?.title;
    this.price = item.product?.price;
  }
}