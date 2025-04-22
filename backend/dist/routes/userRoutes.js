import express from 'express';
import passport from 'passport';
import {
  createNewUser,
  getUsers,
  removeUser,
} from '../controllers/userController.js';
const router = express.Router();
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createNewUser,
);
router.get('/', getUsers);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  removeUser,
);
export default router;
