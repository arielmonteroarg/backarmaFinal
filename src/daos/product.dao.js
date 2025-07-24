import Product from './mongo/models/Product.js';

export default class ProductDAO {
  async getPaginated({ limit = 10, page = 1, sort, query }) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const filter = {};

    if (query) {
      if (query.startsWith('category=')) {
        filter.category = query.split('=')[1];
      } else if (query.startsWith('status=')) {
        filter.status = query.split('=')[1] === 'true';
      }
    }

    return await Product.paginate(filter, options);
  }

  async getById(id) {
    return await Product.findById(id).lean();
  }

  async create(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}