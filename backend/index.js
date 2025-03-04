const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { authenticateDB } = require('./config/db.js');
const { Event, syncModel: syncEventModel } = require('./models/event.js');
const { User, syncModel: syncUserModel } = require('./models/user.js');
const eventsRouter = require('./routes/eventRoutes.js'); 
const usersRouter = require('./routes/userRoutes.js');
const eventAPI = require('./api/eventsAPI.js'); 
const userAPI = require('./api/usersAPI.js'); 
const { swaggerUi, swaggerDocs } = require('./swagger');
const app = express();
const PORT = process.env.PORT ; 
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Warning: Request from origin "${origin}" is not allowed by CORS policy.`);
      callback(new Error('Origin not permitted by CORS policy.'), false);
    }
  },
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());   
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use((err, req, res, next) => {
  if (err.message === 'Origin not permitted by CORS policy.') {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

dotenv.config();
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/events', eventsRouter); 
app.use('/users', usersRouter);  

app.listen(PORT, async (err) => {
  if (err) {
    console.error(`Ошибка при запуске сервера: ${err.message}`);
    return;
  }
  console.log(`Сервер запущен на порту ${PORT}`);

  await syncUserModel();
  await syncEventModel();
});
