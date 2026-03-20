import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { OrdersService } from '../services/orders.service';
import { ResponseUtil } from '../utils/response.util';
import { checkoutSchema } from '../validators/orders.validator';

export class OrdersController {
  static async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const payload = checkoutSchema.parse(req.body);
      const data = await OrdersService.checkout(req.user.userId, payload);

      return ResponseUtil.success(res, data, 201);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }
}
