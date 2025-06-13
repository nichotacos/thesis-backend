import express from 'express';
import { login, refreshAccessToken, logout } from '../controllers/authController.js';
import { storeUser } from '../controllers/UserController.js';
import { generateOtp, verifyOtp } from '../controllers/otpController.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);
router.post('/register', storeUser);
router.post('/send-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

export default router;
