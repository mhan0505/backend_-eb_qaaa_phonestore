import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ResponseUtil } from '../utils/response.util';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT access token
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      const payload = JwtUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      return ResponseUtil.unauthorized(res, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is admin
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return ResponseUtil.forbidden(res, 'Admin access required');
  }
  next();
};
