import ProductDAO from '../daos/product.dao.js';

export default class ProductRepository {
  constructor() {
    this.dao = new ProductDAO();
  }

  async getPaginatedProducts(queryParams) {
    return await this.dao.getPaginated(queryParams);
  }

  async getProductById(id) {
    return await this.dao.getById(id);
  }

  async createProduct(productData) {
    return await this.dao.create(productData);
  }

  async updateProduct(id, updateData) {
    return await this.dao.update(id, updateData);
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }
}