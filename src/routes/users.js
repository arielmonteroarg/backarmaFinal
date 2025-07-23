import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/checkAuth.js';

const router = Router();
const controller = new UserController();

/* === Rutas públicas === */
router.get('/',        controller.getUsers);   // ver usuarios
router.post('/',       controller.createUser); // crear usuario

/* === Rutas protegidas === */
router.get('/:id',     isAuthenticated, controller.getUserById);
router.put('/:id',     isAuthenticated, controller.updateUser);
router.delete('/:id',  isAuthenticated, isAdmin, controller.deleteUser);

export default router;