import express from 'express';
import { createModule, getModules } from '../controllers/moduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/module', getModules);
router.post('/module/create', createModule);

export default router;