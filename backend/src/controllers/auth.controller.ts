import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { JWTPayload } from '../middleware/auth.middleware';

// Tạo JWT token
const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d', 
  });
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Tạo token
    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Đăng ký (chỉ tạo user role)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, phone_number } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Username, email and password are required' 
      });
    }

    // Kiểm tra user đã tồn tại
    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByUsername = await User.findOne({ where: { username } });
    
    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ 
        message: 'Username or email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Tạo user mới (luôn là role 'user')
    const newUser = await User.create({
      username,
      email,
      password_hash,
      name,
      phone_number,
      role: 'user', // Chỉ tạo user, không tạo admin
    });

    // Tạo token
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy profile user hiện tại
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!; // Đã được authenticate

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Cập nhật profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { name, phone_number } = req.body;

    await user.update({
      name: name || user.name,
      phone_number: phone_number || user.phone_number,
    });

    return res.json({
      message: 'Profile updated successfully',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
