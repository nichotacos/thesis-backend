import express from 'express';
import { createModule, getModules } from '../controllers/moduleController.js';

const router = express.Router();

router.get('/module', getModules);
router.post('/module', createModule);

export default router;