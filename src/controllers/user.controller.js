import UserService from '../services/user.service.js';
import { createHash } from '../utils.js';

export default class UserController {
  constructor() {
    this.service = new UserService();
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.service.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.service.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const data = { ...req.body, password: createHash(req.body.password) };
      const user = await this.service.createUser(data);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const user = await this.service.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const deleted = await this.service.deleteUser(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado', deleted });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}