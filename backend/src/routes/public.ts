import express from "express";

const router = express.Router();
import { getEvents} from "../controllers/eventController.js";
import {me} from "../controllers/authController.js";
router.get("/events", getEvents);
router.get("/me", me);
export default router;
