import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@models/user';
import dotenv from 'dotenv';

dotenv.config();

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const register = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Успешная регистрация', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Неверный email или пароль' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Неверный email или пароль' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' },
    );

    res.json({
      message: 'Успешный вход',
      token,
    });
  } catch (error) {
    next(error);
  }
};
