import ProductService from '../services/product.service.js';

export default class ProductController {
  constructor() {
    this.service = new ProductService();
  }

  getProducts = async (req, res) => {
    try {
      const result = await this.service.getProducts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getProductById = async (req, res) => {
    try {
      const product = await this.service.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createProduct = async (req, res) => {
    try {
      const newProduct = await this.service.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const updated = await this.service.updateProduct(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const deleted = await this.service.deleteProduct(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado', deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}