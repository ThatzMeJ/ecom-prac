import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config';

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  // Generate JWT token
  static generateToken(user: User): string {
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(
      payload,
      config.JWT_SECRET as jwt.Secret,
      {
        expiresIn: config.JWT_EXPIRES_IN || '24h',
        issuer: 'user-service'
      }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user: User): string {
    if (!config.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET not configured');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'user-service'
      }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): TokenPayload {
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): TokenPayload {
    if (!config.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET not configured');
    }

    return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Compare password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate token pair (access + refresh)
  static generateTokenPair(user: User) {
    return {
      accessToken: this.generateToken(user),
      refreshToken: this.generateRefreshToken(user),
      expiresIn: config.JWT_EXPIRES_IN || '24h'
    };
  }
} 