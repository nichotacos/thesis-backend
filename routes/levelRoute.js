import express from "express";
import { createLevel, getLevels } from "../controllers/levelController.js";

const router = express.Router();

router.get('/level', getLevels);
router.post('/level', createLevel);

export default router;
