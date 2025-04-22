import express from 'express';
import passport from 'passport';
import {
  getAllEvents,
  getEvent,
  addEvent,
  modifyEvent,
  removeEvent,
} from '@controllers/eventController';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.post('/', passport.authenticate('jwt', { session: false }), addEvent);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  modifyEvent,
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  removeEvent,
);

export default router;
