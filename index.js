const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
dotenv.config();
const app = express();
app.use(express.json()); 
app.use(cors()); 

const PORT = process.env.PORT; 

app.get('/', (req, res) => {
    res.json({ message: '123' });
});
const { authenticateDB } = require('./config/db.js');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
const { Event, syncModel: syncEventModel } = require('./models/event'); 
const { User, syncModel: syncUserModel } = require('./models/user'); 
const eventAPI = require('./api/eventAPI');
const userAPI = require('./api/userAPI');

User.hasMany(Event, {
    foreignKey: 'createdBy',
    sourceKey: 'id',
});

Event.belongsTo(User, {
    foreignKey: 'createdBy',
    targetKey: 'id',
});
const { swaggerUi, swaggerDocs } = require('./swagger');
const eventsRouter = require('./API/eventAPI');
const usersRouter = require('./API/userAPI');
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/events', eventAPI);
app.use('/users', userAPI);


app.listen(PORT, async (err) => {
    if (err) {
        console.error(`Ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`Сервер запущен на порту ${PORT}`);

    await syncUserModel(); 
    await syncEventModel(); 
});
