import jwtPackage from 'jsonwebtoken';
const { sign, verify, TokenExpiredError, JsonWebTokenError } = jwtPackage;
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, middleName, email, gender, birthDate, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            middleName,
            email,
            gender,
            birthDate,
            password: hashedPassword,
            createdAt: new Date()
        });
        res.status(201).json({
            message: 'Успешная регистрация',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                email: user.email,
                gender: user.gender,
                birthDate: user.birthDate
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
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
        const payload = {
            id: user.id,
            email: user.email
        };
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET не задан');
        }
        const token = sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000,
            domain: 'localhost'
        });
        res.json({
            message: 'Успешный вход',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                email: user.email,
                gender: user.gender,
                birthDate: user.birthDate
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.json({ message: 'Вы вошли как гость' });
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET не задан');
            }
            const decoded = verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const user = await User.findByPk(userId);
            if (user) {
                res.json({ id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    email: user.email,
                    gender: user.gender,
                    birthDate: user.birthDate });
                return;
            }
            else {
                res.status(404).json({ message: 'Пользователь не найден' });
                return;
            }
        }
        catch (error) {
            console.error("Ошибка верификации токена:", error instanceof Error ? error.message : String(error));
            if (error instanceof TokenExpiredError) {
                res.status(401).json({ message: 'Токен истек' });
                return;
            }
            else if (error instanceof JsonWebTokenError) {
                res.status(401).json({ message: 'Неверный токен' });
                return;
            }
            res.status(401).json({ message: 'Ошибка авторизации' });
            return;
        }
    }
    catch (error) {
        console.error("Ошибка сервера:", error instanceof Error ? error.message : String(error));
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.removeHeader('Authorization');
        res.status(200).json({
            success: true,
            message: 'Успешный выход из системы'
        });
    }
    catch (error) {
        next(error);
    }
};
