import express from "express";
import { createLevel, getLevels } from "../controllers/levelController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get('/level', getLevels);
router.post('/level', upload.single("level_image"), createLevel);

export default router;
