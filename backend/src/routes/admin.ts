import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Test route
router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    message: 'Welcome to admin dashboard!',
    user: {
      user_id: req.user!.user_id,
      username: req.user!.username,
      role: req.user!.role,
    },
  });
});

// Lấy danh sách tất cả users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const User = require('../models/User').default;
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'email', 'phone_number', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    res.json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
