import express from 'express';
import { createShopItem, getShop } from '../controllers/shopController.js';

const router = express.Router();

router.get('/shop-item', getShop);
router.post('/shop-item', createShopItem);

export default router;