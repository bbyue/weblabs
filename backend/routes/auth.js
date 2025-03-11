const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { JWT_SECRET } = process.env;

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Проверка, существует ли пользователь с таким email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хэширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Возвращаем успешный ответ
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при регистрации пользователя', error });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Запрос на авторизацию:', { email }); // Логируем входящий запрос

    try {
        // Поиск пользователя по email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('Пользователь с таким email не найден:', email); // Логируем отсутствие пользователя
            return res.status(401).json({ message: 'Пользователь с таким email не найден' });
        }

        console.log('Пользователь найден:', user.id); // Логируем найденного пользователя

        // Логируем введенный пароль и хэш из базы данных
        console.log('Введенный пароль:', password);
        console.log('Хэш пароля из базы данных:', user.password);

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Неверный пароль для пользователя:', user.id); // Логируем неверный пароль
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        console.log('Пароль верный для пользователя:', user.id); // Логируем успешную проверку пароля

        // Генерация JWT-токена
        const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });

        console.log('Токен успешно сгенерирован для пользователя:', user.id); // Логируем генерацию токена

        // Отправка токена клиенту
        res.json({ message: 'Авторизация успешна', token });
    } catch (error) {
        console.error('Ошибка при авторизации:', error); // Логируем ошибку
        res.status(500).json({ message: 'Ошибка при авторизации', error });
    }
});
module.exports = router;