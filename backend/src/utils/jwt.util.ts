import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
const ACCESS_EXPIRE: SignOptions['expiresIn'] =
  (process.env.JWT_ACCESS_EXPIRE as SignOptions['expiresIn']) || '15m';
const REFRESH_EXPIRE: SignOptions['expiresIn'] =
  (process.env.JWT_REFRESH_EXPIRE as SignOptions['expiresIn']) || '7d';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export class JwtUtil {
  /**
   * Generate access token (short-lived)
   */
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRE,
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRE,
      jwtid: randomUUID(),
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Calculate expiration date for refresh token
   */
  static getRefreshTokenExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // 7 days
    return expiry;
  }
}
