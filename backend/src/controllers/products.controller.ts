import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ProductsService } from '../services/products.service';
import { ResponseUtil } from '../utils/response.util';
import { listProductsQuerySchema, productIdentifierSchema } from '../validators/product.validator';

export class ProductsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listProductsQuerySchema.parse(req.query);
      const data = await ProductsService.listProducts(query);
      return ResponseUtil.success(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = productIdentifierSchema.parse(req.params);
      const data = await ProductsService.getProductDetail(identifier);
      return ResponseUtil.success(res, data);
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validationError(res, error.errors);
      }
      next(error);
    }
  }
}
