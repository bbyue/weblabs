import Event from '../models/event.js';
import { Op } from 'sequelize';
const getEvents = async (search, page, limit) => {
    const offset = (page - 1) * limit;
    if (search) {
        return await Event.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                ],
            },
            limit,
            offset,
        });
    }
    else {
        return await Event.findAll({
            limit,
            offset,
        });
    }
};
const getEventById = async (id) => {
    const event = await Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    return event;
};
const createEvent = async (eventData) => {
    const { title, description, date, createdBy } = eventData;
    if (!title || !date || !createdBy) {
        throw new Error('Необходимы обязательные поля: title, date, createdBy');
    }
    return await Event.create({ title, description, date, createdBy });
};
const updateEvent = async (id, eventData) => {
    const event = await Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    await event.update(eventData);
    return event;
};
const deleteEvent = async (id) => {
    const event = await Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    await event.destroy();
};
export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
