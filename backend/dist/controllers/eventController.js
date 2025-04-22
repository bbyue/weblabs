import { __awaiter } from 'tslib';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/eventsAPI.js';
export const getAllEvents = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { search, page = 1, limit = 10 } = req.query;
    try {
      const events = yield getEvents(search, Number(page), Number(limit));
      res.status(200).json(events);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
export const getEvent = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
      const event = yield getEventById(id);
      res.status(200).json(event);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
export const addEvent = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const newEvent = yield createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
export const modifyEvent = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }
    try {
      const updatedEvent = yield updateEvent(id, req.body);
      res.status(200).json(updatedEvent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
export const removeEvent = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }
    try {
      yield deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
