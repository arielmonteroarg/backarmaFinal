import UserDAO from '../daos/user.dao.js';
import { UserDTO } from '../dtos/user.dto.js';

export default class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  async create(data) {
    const user = await this.dao.create(data);
    return new UserDTO(user);
  }

  async findByEmail(email) {
    const user = await this.dao.findByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async findById(id) {
    const user = await this.dao.findById(id);
    return user ? new UserDTO(user) : null;
  }

  async findAll(filter = {}) {
    const users = await this.dao.findAll(filter);
    return users.map(user => new UserDTO(user));
  }

  async update(id, data) {
    const updated = await this.dao.update(id, data);
    return updated ? new UserDTO(updated) : null;
  }

  async delete(id) {
    const deleted = await this.dao.delete(id);
    return deleted ? new UserDTO(deleted) : null;
  }
}