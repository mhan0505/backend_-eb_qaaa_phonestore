import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response.util';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validators/auth.validator';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await AuthService.register(validatedData);

      return ResponseUtil.success(res, result, 201);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await AuthService.login(validatedData);

      return ResponseUtil.success(res, result);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedData = refreshTokenSchema.parse(req.body);

      // Refresh token
      const result = await AuthService.refreshToken(validatedData.refreshToken);

      return ResponseUtil.success(res, result);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedData = logoutSchema.parse(req.body);

      // Logout user
      const result = await AuthService.logout(validatedData.refreshToken);

      return ResponseUtil.success(res, result);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      // Get user details
      const user = await AuthService.getCurrentUser(req.user.userId);

      return ResponseUtil.success(res, { user });
    } catch (error) {
      next(error);
    }
  }
}
