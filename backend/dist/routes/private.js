import express from "express";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
import { createEvent, getEventById, updateEvent, deleteEvent, } from "../controllers/eventController.js";
import { createUser, getUsers, getUserById, updateUser, deleteUser, } from "../controllers/userController.js";
const authenticate = passport.authenticate("jwt", { session: false });
const combinedAuth = (req, res, next) => {
    authenticate(req, res, (err) => {
        if (err) {
            authMiddleware(req, res, next);
        }
        else {
            next();
        }
    });
};
router.post("/events", combinedAuth, createEvent);
router.get("/events/:id", combinedAuth, getEventById);
router.put("/events/:id", combinedAuth, updateEvent);
router.delete("/events/:id", combinedAuth, deleteEvent);
router.post("/users", combinedAuth, createUser);
router.get("/users", combinedAuth, getUsers);
router.get("/users/:id", combinedAuth, getUserById);
router.put("/users/:id", combinedAuth, updateUser);
router.delete("/users/:id", combinedAuth, deleteUser);
export default router;
