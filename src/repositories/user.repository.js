import User from '../daos/mongo/models/User.js';
import { UserDTO } from '../dtos/user.dto.js';

export default class UserRepository {
  async create(data) {
    const newUser = await User.create(data);
    return new UserDTO(newUser);
  }

  async findByEmail(email) {
    const user = await User.findOne({ email }).lean();
    return user ? new UserDTO(user) : null;
  }

  async findById(id) {
    const user = await User.findById(id).lean();
    return user ? new UserDTO(user) : null;
  }

  async findAll(filter = {}) {
    const users = await User.find(filter).lean();
    return users.map(user => new UserDTO(user));
  }

  async update(id, data) {
    const updated = await User.findByIdAndUpdate(id, data, { new: true }).lean();
    return updated ? new UserDTO(updated) : null;
  }

  async delete(id) {
    const deleted = await User.findByIdAndDelete(id).lean();
    return deleted ? new UserDTO(deleted) : null;
  }
}
