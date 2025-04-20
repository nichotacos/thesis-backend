import express from 'express';
import { createQuestions, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.post('/question', getQuestions);
router.post('/question/create', createQuestions);

export default router;