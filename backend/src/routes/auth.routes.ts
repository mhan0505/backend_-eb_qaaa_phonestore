import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', AuthController.register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', AuthController.login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', AuthController.refresh);

/**
 * POST /api/auth/logout
 * Logout user (revoke refresh token)
 */
router.post('/logout', AuthController.logout);

/**
 * GET /api/auth/me
 * Get current user info (protected route)
 */
router.get('/me', authMiddleware, AuthController.getCurrentUser);

export default router;
