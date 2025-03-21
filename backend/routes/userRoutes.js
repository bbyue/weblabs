const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, getAllUsers, deleteUser } = require('../api/usersAPI');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', passport.authenticate('jwt', { session: false }),async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешно получены пользователи
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUser(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        if (error.message === 'Пользователь не найден') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
});

module.exports = router;