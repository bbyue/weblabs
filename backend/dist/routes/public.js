import express from "express";
const router = express.Router();
import { getEvents } from "../controllers/eventController.js";
import { me } from "../controllers/authController.js";
import { getUsers } from "../controllers/userController.js";
router.get("/events", getEvents);
router.get("/me", me);
router.get("/users", getUsers);
export default router;
