import User from "../models/user.js";
import Event from "../models/event.js";
import { Op } from "sequelize";
const createEvent = async (req, res) => {
    const { title, date, createdBy } = req.body;
    if (!title || !date || !createdBy) {
        res.status(400).json({ message: "не все обязательные поля указаны" });
        return;
    }
    try {
        const existingUser = await User.findOne({ where: { id: createdBy } });
        if (!existingUser) {
            res.status(404).json({ message: "пользователя не существует" });
            return;
        }
        const eventData = req.body;
        const newEvent = await Event.create(eventData);
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при создании мероприятия",
            details: error.message,
        });
    }
};
const getEvents = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let whereClause = {};
        if (startDate && endDate) {
            const startDateStr = startDate;
            const endDateStr = endDate;
            if (startDateStr && endDateStr) {
                whereClause = {
                    date: {
                        [Op.gte]: new Date(startDateStr),
                        [Op.lte]: new Date(endDateStr),
                    },
                };
            }
            else {
                res
                    .status(400)
                    .json({ error: "startDate и endDate должны быть строками" });
                return;
            }
        }
        const events = await Event.findAll({
            where: whereClause,
        });
        res.status(200).json(events);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении мероприятий",
            details: error.message,
        });
    }
};
const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            res.status(404).json({ error: "мероприятие не найдено" });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении мероприятия",
            details: error.message,
        });
    }
};
const updateEvent = async (req, res) => {
    try {
        const [updated] = await Event.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            res.status(404).json({ error: "мероприятие не найдено" });
            return;
        }
        const updatedEvent = await Event.findByPk(req.params.id);
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при обновлении мероприятия",
            details: error.message,
        });
    }
};
const deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            res.status(404).json({ error: "мероприятие не найдено" });
            return;
        }
        res.status(204).json();
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при удалении мероприятия",
            details: error.message,
        });
    }
};
export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
