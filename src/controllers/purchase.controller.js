import PurchaseService from '../services/purchase.service.js';

export const checkoutCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const ticket = await PurchaseService.finalizePurchase(cid);

    res.status(200).json({ status: 'success', ticket });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};