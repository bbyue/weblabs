import { __awaiter } from 'tslib';
import Event from '@models/event';
import { Op } from 'sequelize';
const getEvents = (search, page, limit) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
    } else {
      return yield Event.findAll({
        limit,
        offset,
      });
    }
  });
const getEventById = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    return event;
  });
const createEvent = (eventData) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, createdBy } = eventData;
    if (!title || !date || !createdBy) {
      throw new Error('Необходимы обязательные поля: title, date, createdBy');
    }
    return yield Event.create({ title, description, date, createdBy });
  });
const updateEvent = (id, eventData) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    yield event.update(eventData);
    return event;
  });
const deleteEvent = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event.findByPk(id);
    if (!event) {
      throw new Error('Мероприятие не найдено');
    }
    yield event.destroy();
  });
export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
