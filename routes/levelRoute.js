import express from "express";
import { createLevel, getLevels } from "../controllers/levelController.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/level', getLevels);
router.post('/level', upload.single("level_image"), createLevel);

export default router;
