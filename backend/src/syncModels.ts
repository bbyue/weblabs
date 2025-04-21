import User from './models/user.js';
import Event from './models/event.js';
import LoginHistory from './models/loginHistory.js';

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

export { syncModels };
