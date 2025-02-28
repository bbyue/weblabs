const express = require('express');
const { Event } = require('../models/event');
const router = express.Router();
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для управления мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить все мероприятия
 *     tags: [Events]
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Ключевое слово для поиска мероприятий
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Номер страницы
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Количество мероприятий на странице
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешно получены мероприятия
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        let events;
        if (search) {
            events = await Event.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${search}%` } },
                        { description: { [Op.iLike]: `%${search}%` } }
                    ]
                },
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        } else {
            events = await Event.findAll({
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        }
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID мероприятия
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешно получено мероприятие
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при получении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', async (req, res) => {
    const { title, description, date, createdBy } = req.body;
    if (!title || !date || !createdBy) {
        return res.status(400).json({ error: 'Необходимы обязательные поля: title, date, createdBy' });
    }
    try {
        const newEvent = await Event.create({ title, description, date, createdBy });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID мероприятия
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               createdBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, createdBy } = req.body;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }
        await event.update({ title, description, date, createdBy });
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при обновлении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID мероприятия
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }
        await event.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;