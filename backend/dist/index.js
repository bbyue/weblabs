import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { syncModels } from './syncModels.js';
import privateRouter from './routes/private.js';
import publicRouter from './routes/public.js';
import authRouter from './routes/auth.js';
import passport from 'passport';
import './config/passport.js';
import { swaggerUi, swaggerDocs } from './swagger.js';
import 'module-alias/register.js';
import 'tsconfig-paths/register.js';
import { authMiddleware } from './apiMiddleware.js';
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
const errorHandler = (err, req, res, next) => {
    if (err.message === 'Origin not permitted by CORS policy.') {
        res.status(403).json({ message: err.message });
        return;
    }
    next(err);
};
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(errorHandler);
dotenv.config();
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/public', publicRouter);
app.use('/private', privateRouter);
app.use(passport.initialize());
app.use('/auth', authRouter);
app.use(authMiddleware);
app.listen(PORT, async (err) => {
    if (err) {
        console.error(`Ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`Сервер запущен на порту ${PORT}`);
    await syncModels();
});
