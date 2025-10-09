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
    throw new Error('Thiếu cấu hình JWT_SECRET trong biến môi trường');
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
        message: 'Vui lòng nhập email và mật khẩu' 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
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
    const { username, email, password, phone_number } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập username, email và mật khẩu' 
      });
    }

    const existingUserByEmail = await User.findOne({ where: { email } });
    const existingUserByUsername = await User.findOne({ where: { username } });
    
    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({ 
        message: 'Username hoặc email đã tồn tại' 
      });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password_hash,
      phone_number,
      role: 'user',
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
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
    const user = req.user!;

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
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
    const { phone_number } = req.body;

    await user.update({
      phone_number: phone_number || user.phone_number,
    });

    return res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
