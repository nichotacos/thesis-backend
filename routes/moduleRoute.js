import express from 'express';
import { createModule, getModules } from '../controllers/moduleController.js';

const router = express.Router();

router.post('/module', getModules);
router.post('/module/create', createModule);

export default router;