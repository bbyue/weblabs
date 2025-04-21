var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { syncModels } from './syncModels.js';
import eventsRouter from './routes/eventRoutes.js';
import usersRouter from './routes/userRoutes.js';
import authRouter from './routes/auth.js';
import passport from 'passport';
import './config/passport.js';
import { swaggerUi, swaggerDocs } from './swagger.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
const errorHandler = (err, req, res, next) => {
    if (err.message === 'Origin not permitted by CORS policy.') {
        res.status(403).json({ message: err.message });
        return;
    }
    next(err);
};
app.use(errorHandler);
dotenv.config();
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use(passport.initialize());
app.use('/auth', authRouter);
app.listen(PORT, (err) => __awaiter(void 0, void 0, void 0, function* () {
    if (err) {
        console.error(`Ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`Сервер запущен на порту ${PORT}`);
    yield syncModels();
}));
