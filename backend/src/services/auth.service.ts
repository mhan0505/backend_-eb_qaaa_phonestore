import { UserRepository, RefreshTokenRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register new user
   */
  static async register(data: RegisterData) {
    // Check if email already exists
    const emailExists = await UserRepository.emailExists(data.email);
    if (emailExists) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    // Validate password strength
    const passwordValidation = PasswordUtil.validateStrength(data.password);
    if (!passwordValidation.valid) {
      throw new AppError(400, 'WEAK_PASSWORD', passwordValidation.message!);
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(data.password);

    // Create user
    const user = await UserRepository.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone,
    });

    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    // Save refresh token to DB
    const expiresAt = JwtUtil.getRefreshTokenExpiry();
    await RefreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  static async login(data: LoginData) {
    // Find user by email
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(403, 'ACCOUNT_INACTIVE', 'Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    // Save refresh token to DB
    const expiresAt = JwtUtil.getRefreshTokenExpiry();
    await RefreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string) {
    // Verify token signature
    let payload;
    try {
      payload = JwtUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    // Check if token exists in DB (not revoked)
    const tokenRecord = await RefreshTokenRepository.findByToken(refreshToken);
    if (!tokenRecord) {
      throw new AppError(401, 'TOKEN_REVOKED', 'Refresh token has been revoked');
    }

    // Check if token expired
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      await RefreshTokenRepository.deleteByToken(refreshToken);
      throw new AppError(401, 'TOKEN_EXPIRED', 'Refresh token has expired');
    }

    // Check if user is active
    if (!tokenRecord.user.isActive) {
      throw new AppError(403, 'ACCOUNT_INACTIVE', 'Account has been deactivated');
    }

    // Generate new access token
    const newAccessToken = JwtUtil.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Logout user (revoke refresh token)
   */
  static async logout(refreshToken: string) {
    await RefreshTokenRepository.deleteByToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(userId: number) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }
    return user;
  }
}
