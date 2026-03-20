import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ResponseUtil } from '../utils/response.util';
import { CartBusinessService } from '../services/cart.service';
import {
  addCartItemSchema,
  cartVariantParamSchema,
  updateCartItemSchema,
} from '../validators/cart.validator';

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const data = await CartBusinessService.getCart(req.user.userId);
      return ResponseUtil.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const input = addCartItemSchema.parse(req.body);
      const data = await CartBusinessService.addItem(req.user.userId, input);
      return ResponseUtil.success(res, data, 201);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { variantId } = cartVariantParamSchema.parse(req.params);
      const { quantity } = updateCartItemSchema.parse(req.body);

      const data = await CartBusinessService.updateItem(req.user.userId, variantId, quantity);
      return ResponseUtil.success(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { variantId } = cartVariantParamSchema.parse(req.params);
      const data = await CartBusinessService.removeItem(req.user.userId, variantId);
      return ResponseUtil.success(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }
}
