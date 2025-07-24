import { Router } from 'express';
import PurchaseService from '../services/purchase.service.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const userId = req.user._id; // o req.session.user._id
    const userEmail = req.user.email;

    const ticket = await PurchaseService.finalizePurchase(userId, userEmail);

    res.status(200).json({ message: 'Compra finalizada con éxito', ticket });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;