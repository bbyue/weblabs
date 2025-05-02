import Event from '../models/event.js';
import { Op } from 'sequelize';

interface EventData {
  title: string;
  description?: string | null;
  date: Date;
  createdBy: number;
}

const getEvents = async (
  search: string | undefined,
  page: number,
  limit: number,
): Promise<Event[]> => {
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
  } else {
    return await Event.findAll({
      limit,
      offset,
    });
  }
};

const getEventById = async (id: number): Promise<Event> => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Мероприятие не найдено');
  }
  return event;
};

const createEvent = async (eventData: EventData): Promise<Event> => {
  const { title, description, date, createdBy } = eventData;

  if (!title || !date || !createdBy) {
    throw new Error('Необходимы обязательные поля: title, date, createdBy');
  }

  return await Event.create({ title, description, date, createdBy });
};

const updateEvent = async (
  id: number,
  eventData: Partial<EventData>,
): Promise<Event> => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Мероприятие не найдено');
  }
  await event.update(eventData);
  return event;
};

const deleteEvent = async (id: number): Promise<void> => {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Мероприятие не найдено');
  }
  await event.destroy();
};

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
