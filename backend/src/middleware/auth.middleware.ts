import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Request interface để thêm user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

// Middleware xác thực JWT
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Lấy user từ DB để đảm bảo user vẫn tồn tại
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware phân quyền
export const requireRole = (requiredRole: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.hasPermission(requiredRole)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${requiredRole}` 
      });
    }

    next();
  };
};

// Middleware chỉ admin
export const requireAdmin = requireRole('admin');
