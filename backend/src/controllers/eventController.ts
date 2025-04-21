import { Request, Response, NextFunction } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/eventsAPI.js';

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { search, page = 1, limit = 10 } = req.query;

  try {
    const events = await getEvents(
      search as string,
      Number(page),
      Number(limit),
    );
    res.status(200).json(events);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  try {
    const event = await getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const addEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newEvent = await createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
export const modifyEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  try {
    const updatedEvent = await updateEvent(id, req.body);
    res.status(200).json(updatedEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const removeEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid event ID' });
    return;
  }

  try {
    await deleteEvent(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
