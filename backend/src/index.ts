import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
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
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.message === 'Origin not permitted by CORS policy.') {
    res.status(403).json({ message: err.message });
    return;
  }
  next(err);
};

app.use(errorHandler);

dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API!' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use(passport.initialize());
app.use('/auth', authRouter);

app.listen(PORT, async (err?: Error) => {
  if (err) {
    console.error(`Ошибка при запуске сервера: ${err.message}`);
    return;
  }
  console.log(`Сервер запущен на порту ${PORT}`);

  await syncModels();
});
