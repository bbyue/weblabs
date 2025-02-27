const express = require('express');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Необходимы обязательные поля: name, email' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;
