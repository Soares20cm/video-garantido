import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register - Create new user account
router.post('/register', authController.register.bind(authController));

// POST /api/auth/login - Authenticate user
router.post('/login', authController.login.bind(authController));

// POST /api/auth/logout - Invalidate session (client-side with JWT)
router.post('/logout', authController.logout.bind(authController));

// GET /api/auth/me - Get current user info (protected)
router.get('/me', authenticate, authController.me.bind(authController));

export default router;

import { uploadImage, handleMulterError } from '../middleware/upload.middleware';

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authenticate, authController.getProfile.bind(authController));

// PUT /api/auth/profile - Update user profile (protected)
router.put(
  '/profile',
  authenticate,
  uploadImage,
  handleMulterError,
  authController.updateProfile.bind(authController)
);
