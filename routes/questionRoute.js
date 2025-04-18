import express from 'express';
import { createQuestions, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.get('/question', getQuestions);
router.post('/question', createQuestions);

export default router;