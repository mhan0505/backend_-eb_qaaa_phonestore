import prisma from '../config/database';
import { Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  role?: Role;
}

export class UserRepository {
  /**
   * Create new user
   */
  static async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role || Role.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        gender: true,
        birthday: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Update user
   */
  static async update(id: number, data: Partial<CreateUserData>) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });
  }
}

/**
 * Refresh Token Repository
 */
export class RefreshTokenRepository {
  /**
   * Create refresh token
   */
  static async create(userId: number, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Find token
   */
  static async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Delete token (logout/revoke)
   */
  static async deleteByToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  /**
   * Delete all user tokens (logout from all devices)
   */
  static async deleteByUserId(userId: number) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Clean expired tokens
   */
  static async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
