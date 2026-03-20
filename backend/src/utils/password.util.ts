import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class PasswordUtil {
  /**
   * Hash password using bcrypt
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   */
  static validateStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    if (password.length > 50) {
      return { valid: false, message: 'Password must be less than 50 characters' };
    }
    return { valid: true };
  }
}
