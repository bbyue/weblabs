import express from "express";
import passport from "passport";
const router = express.Router();

import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserEvents
} from "../controllers/userController.js";

router.post("/events",passport.authenticate('jwt', { session: false }), createEvent);
router.get("/events/:id", passport.authenticate('jwt', { session: false }), getEventById);
router.put("/events/:id", passport.authenticate('jwt', { session: false }), updateEvent);
router.delete("/events/:id",passport.authenticate('jwt', { session: false }), deleteEvent);

router.post("/users", passport.authenticate('jwt', { session: false }), createUser);
router.get("/users/:id", passport.authenticate('jwt', { session: false }), getUserById);
router.put("/users/:id", passport.authenticate('jwt', { session: false }), updateUser);
router.delete("/users/:id", passport.authenticate('jwt', { session: false }), deleteUser);
router.get('/users/:id/events', passport.authenticate('jwt', { session: false }), getUserEvents);

export default router;