import express from "express";
import passport from "passport";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";

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
} from "../controllers/userController.js";

const authenticate = passport.authenticate("jwt", { session: false });

const combinedAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  authenticate(req, res, (err: Error | null) => {
    if (err) {
      authMiddleware(req as AuthenticatedRequest, res, next);
    } else {
      next();
    }
  });
};

router.post("/events",passport.authenticate('jwt', { session: false }), createEvent);
router.get("/events/:id", passport.authenticate('jwt', { session: false }), getEventById);
router.put("/events/:id", passport.authenticate('jwt', { session: false }), updateEvent);
router.delete("/events/:id",passport.authenticate('jwt', { session: false }), deleteEvent);

router.post("/users", passport.authenticate('jwt', { session: false }), createUser);
router.get("/users", passport.authenticate('jwt', { session: false }), getUsers);
router.get("/users/:id", passport.authenticate('jwt', { session: false }), getUserById);
router.put("/users/:id", passport.authenticate('jwt', { session: false }), updateUser);
router.delete("/users/:id", passport.authenticate('jwt', { session: false }), deleteUser);

export default router;