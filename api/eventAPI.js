const express = require('express');
const { Event } = require('../models/event');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

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
