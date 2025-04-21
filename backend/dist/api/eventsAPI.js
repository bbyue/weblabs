var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event from '../models/event.js';
import { Op } from 'sequelize';
const getEvents = (search, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (page - 1) * limit;
    if (search) {
        return yield Event.findAll({
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
        return yield Event.findAll({
            limit,
            offset,
        });
    }
});
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    return event;
});
const createEvent = (eventData) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, createdBy } = eventData;
    if (!title || !date || !createdBy) {
        throw new Error('Необходимы обязательные поля: title, date, createdBy');
    }
    return yield Event.create({ title, description, date, createdBy });
});
const updateEvent = (id, eventData) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    yield event.update(eventData);
    return event;
});
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
        throw new Error('Мероприятие не найдено');
    }
    yield event.destroy();
});
export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
