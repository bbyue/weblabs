import express from 'express';
import { register, login } from '../controllers/authController.js';
const router = express.Router();
router.post('/register', (req, res, next) => {
    register(req, res, next).catch(next);
});
router.post('/login', (req, res, next) => {
    login(req, res, next).catch(next);
});
export default router;
