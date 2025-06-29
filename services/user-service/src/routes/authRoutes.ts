import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware specific to auth routes
const authLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Auth route accessed: ${req.method} ${req.path} at ${new Date().toISOString()}`);
  next();
};

// Apply middleware to all auth routes
router.use(authLogger);

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
router.get('/profile', (req: Request, res: Response) => {
  res.json({
    message: 'User profile',
    user: req.body
  });
});


export default router; 