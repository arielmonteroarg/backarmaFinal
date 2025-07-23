import User from '../daos/mongo/models/User.js';

export default class UserRepository {
  async create(data)            { return User.create(data); }
  async findByEmail(email)      { return User.findOne({ email }).lean(); }
  async findById(id)            { return User.findById(id).lean(); }
  async findAll(filter = {})    { return User.find(filter).lean(); }
  async update(id, data)        { return User.findByIdAndUpdate(id, data, { new: true }).lean(); }
  async delete(id)              { return User.findByIdAndDelete(id).lean(); }
}