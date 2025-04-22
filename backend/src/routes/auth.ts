import express, { Router } from 'express';
import { register, login } from '@controllers/authController';

const router: Router = express.Router();

router.post('/register', (req, res, next) => {
  register(req, res, next).catch(next);
});

router.post('/login', (req, res, next) => {
  login(req, res, next).catch(next);
});

export default router;
