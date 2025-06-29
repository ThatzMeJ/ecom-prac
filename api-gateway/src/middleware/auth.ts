import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// api-gateway/src/middleware/auth.ts
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Public routes that don't need authentication
  const publicRoutes = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/logout',
    '/health',
    '/' // root health check
  ];
  console.log("req", req.path);
  // Skip auth for public routes
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
    return;
  }

  // Check if JWT_SECRET exists
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Validate JWT token
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;

    // Add user info to request object (standard practice)
    req.user = decoded;

    // Also add to headers for downstream services
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-email'] = decoded.email;

    next(); // Continue to proxy handler
  } catch (error) {
    console.error('JWT validation error:', error);
    res.status(401).json({
      error: 'Access denied',
      message: 'Invalid or expired token'
    });
    return;
  }
};