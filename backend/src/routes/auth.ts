import express from "express";
const router = express.Router();
import { authMiddleware } from '../apiMiddleware.js';
import { 
  register, 
  login, 
  logout,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.use(authMiddleware); 
export default router;