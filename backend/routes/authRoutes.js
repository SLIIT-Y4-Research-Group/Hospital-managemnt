import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  getUserProfile, 
  updateUserProfile, 
  verifyOTP, 
  resendOTP,
  refreshTokens,
  validateToken
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// OTP verification routes
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// JWT token management routes
router.post('/refresh', refreshTokens);
router.post('/validate', validateToken);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
