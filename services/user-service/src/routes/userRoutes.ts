import { Router, Request, Response } from 'express';

const router = Router();

// GET /users - Get all users
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Get all users',
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

// GET /users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    message: `Get user with ID: ${id}`,
    user: { id: parseInt(id), name: 'John Doe', email: 'john@example.com' }
  });
});

// POST /users - Create new user
router.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: 'User created successfully',
    user: { id: Date.now(), name, email }
  });
});

// PUT /users/:id - Update user
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  res.json({
    message: `User ${id} updated successfully`,
    user: { id: parseInt(id), name, email }
  });
});

// DELETE /users/:id - Delete user
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    message: `User ${id} deleted successfully`
  });
});

export default router; 