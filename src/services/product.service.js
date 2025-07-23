import ProductRepository from '../repositories/product.repository.js';
import { ProductDTO, ProductListDTO } from '../dtos/product.dto.js';

export default class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getProducts(queryParams = {}) {
    try {
      // Llamar al método correcto con los parámetros de paginación
      const paginatedResult = await this.repository.getPaginatedProducts(queryParams);
      return new ProductListDTO(paginatedResult);
    } catch (error) {
      console.error('Error en ProductService.getProducts:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await this.repository.getProductById(id);
      return product ? new ProductDTO(product) : null;
    } catch (error) {
      console.error('Error en ProductService.getProductById:', error);
      throw error;
    }
  }

  async addProduct(productData) {
    try {
      if (!productData.status) productData.status = true;
      const newProduct = await this.repository.createProduct(productData);
      return new ProductDTO(newProduct);
    } catch (error) {
      console.error('Error en ProductService.addProduct:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await this.repository.updateProduct(id, productData);
      return updatedProduct ? new ProductDTO(updatedProduct) : null;
    } catch (error) {
      console.error('Error en ProductService.updateProduct:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await this.repository.deleteProduct(id);
      return deletedProduct ? new ProductDTO(deletedProduct) : null;
    } catch (error) {
      console.error('Error en ProductService.deleteProduct:', error);
      throw error;
    }
  }
}