import UserRepository from '../repositories/user.repository.js';
import { UserDTO } from '../dtos/user.dto.js';

export default class UserService {
  constructor() {
    this.repo = new UserRepository();
  }

  async createUser(data) {
    const user = await this.repo.create(data);
    return new UserDTO(user);
  }

  async getAllUsers(filter = {}) {
    const users = await this.repo.findAll(filter);
    return users.map(u => new UserDTO(u));
  }

  async getUserById(id) {
    const user = await this.repo.findById(id);
    return user ? new UserDTO(user) : null;
  }

  async getUserByEmail(email) {
    const user = await this.repo.findByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async updateUser(id, data) {
    const user = await this.repo.update(id, data);
    return user ? new UserDTO(user) : null;
  }

  async deleteUser(id) {
    const deleted = await this.repo.delete(id);
    return deleted ? new UserDTO(deleted) : null;
  }
}