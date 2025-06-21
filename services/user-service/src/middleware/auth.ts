import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Extended Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
  };
}

// Middleware for API Gateway forwarded requests
export const verifyGatewayUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // API Gateway should forward user info in headers
    const userId = req.headers['x-user-id'] as string;
    const userEmail = req.headers['x-user-email'] as string;
    const userRole = req.headers['x-user-role'] as string;

    if (!userId || !userEmail) {
      return res.status(401).json({
        error: 'Authentication required - missing user context from gateway'
      });
    }

    // Attach user info to request
    req.user = {
      id: parseInt(userId),
      email: userEmail,
      role: userRole
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid user context from gateway'
    });
  }
};

// Middleware for direct JWT validation (fallback or development)
export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required - missing or invalid token'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};

// Middleware that tries gateway first, then JWT (hybrid approach)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check if request comes from API gateway (has user headers)
  const hasGatewayHeaders = req.headers['x-user-id'] && req.headers['x-user-email'];

  if (hasGatewayHeaders) {
     verifyGatewayUser(req, res, next);
  } else {
     verifyJWT(req, res, next);
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role && roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      error: 'Insufficient permissions'
    });
  };
}; 