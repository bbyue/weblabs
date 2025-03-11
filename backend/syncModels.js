const { sequelize } = require('./config/db');
const { User } = require('./models/user');
const { Event } = require('./models/event');

const syncModels = async () => {
    try {
        User.associate({ Event });
        Event.associate({ User });

        await User.sync({ alter: true });
        console.log('Таблица "users" успешно синхронизирована.');

        await Event.sync({ alter: true });
        console.log('Таблица "events" успешно синхронизирована.');
    } catch (error) {
        console.error('Ошибка при синхронизации таблиц:', error);
    }
};

module.exports = { syncModels };