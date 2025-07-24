import User from './mongo/models/User.js';

export default class UserDAO {
  async create(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async findById(id) {
    return await User.findById(id).lean();
  }

  async findAll(filter = {}) {
    return await User.find(filter).lean();
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return await User.findByIdAndDelete(id).lean();
  }
}