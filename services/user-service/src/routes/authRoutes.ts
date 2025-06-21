import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Middleware specific to auth routes
const authLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Auth route accessed: ${req.method} ${req.path} at ${new Date().toISOString()}`);
  next();
};

// Apply middleware to all auth routes
router.use(authLogger);

// POST /auth/login - User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Simulate validation
    if (!email || !password) {
       res.status(400).json({
        error: 'Email and password are required'
      });
      return;
    }

    // In real app, you'd fetch user from database and verify password
    // For demo, we'll simulate a successful login
    const mockUser = {
      id: 1,
      email,
      name: 'John Doe',
      role: 'user'
    };

    const tokens = AuthService.generateTokenPair(mockUser);

    res.json({
      message: 'Login successful',
      ...tokens,
      user: { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/register - User registration
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      error: 'Name, email, and password are required'
    });
    return;
  }

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: Date.now(), name, email }
  });
});

// POST /auth/logout - User logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    message: 'Logout successful'
  });
});

// GET /auth/profile - Get user profile (protected route example)
router.get('/profile', authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'User profile',
    user: req.user
  });
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
       res.status(400).json({ error: 'Refresh token required' });
       return;
      }

    const decoded = AuthService.verifyRefreshToken(refreshToken);

    // In real app, you'd fetch user from database
    const mockUser = {
      id: decoded.id,
      email: decoded.email,
      name: 'John Doe',
      role: decoded.role
    };

    const newAccessToken = AuthService.generateToken(mockUser);

    res.json({
      accessToken: newAccessToken,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router; 