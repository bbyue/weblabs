const { sequelize } = require('./config/db');
const { User } = require('./models/user');
const { Event } = require('./models/event');
const { LoginHistory } = require('./models/loginHistory');

const syncModels = async () => {
    try {
        User.associate({ Event, LoginHistory });
        Event.associate({ User });
        LoginHistory.associate({ User });

        await User.sync({ alter: true });
        console.log('Таблица "users" успешно синхронизирована.');

        await Event.sync({ alter: true });
        console.log('Таблица "events" успешно синхронизирована.');

        await LoginHistory.sync({ alter: true });
        console.log('Таблица "login_history" успешно синхронизирована.');
    } catch (error) {
        console.error('Ошибка при синхронизации таблиц:', error);
    }
};

module.exports = { syncModels };