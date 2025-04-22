import { __awaiter } from 'tslib';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
export const register = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { name, email, password } = req.body;
      const existingUser = yield User.findOne({ where: { email } });
      if (existingUser) {
        res
          .status(400)
          .json({ message: 'Пользователь с таким email уже существует' });
        return;
      }
      const hashedPassword = yield bcrypt.hash(password, 10);
      const user = yield User.create({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });
      res.status(201).json({ message: 'Успешная регистрация', user });
    } catch (error) {
      next(error);
    }
  });
export const login = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      const user = yield User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Неверный email или пароль' });
        return;
      }
      const isPasswordValid = yield bcrypt.compare(password, user.password);
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
  });
