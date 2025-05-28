import express from 'express';
import { createShopItem, getShop } from '../controllers/shopController.js';
import upload from '../middlewares/uploadMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/shop-item', getShop);
router.post('/shop-item', upload.single("image"), createShopItem);

export default router;