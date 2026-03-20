import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ResponseUtil {
  /**
   * Success response
   */
  static success<T>(res: Response, data: T, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   */
  static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
  ) {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Validation error
   */
  static validationError(res: Response, errors: any) {
    return this.error(res, 'VALIDATION_ERROR', 'Validation failed', 400, errors);
  }

  /**
   * Unauthorized error
   */
  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, 'UNAUTHORIZED', message, 401);
  }

  /**
   * Forbidden error
   */
  static forbidden(res: Response, message: string = 'Forbidden') {
    return this.error(res, 'FORBIDDEN', message, 403);
  }

  /**
   * Not found error
   */
  static notFound(res: Response, message: string = 'Resource not found') {
    return this.error(res, 'NOT_FOUND', message, 404);
  }

  /**
   * Internal server error
   */
  static serverError(res: Response, message: string = 'Internal server error') {
    return this.error(res, 'SERVER_ERROR', message, 500);
  }
}
