import { __awaiter } from 'tslib';
import User from './models/user.js';
import Event from './models/event.js';
import LoginHistory from './models/loginHistory.js';
const syncModels = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      User.associate({ Event, LoginHistory });
      Event.associate({ User });
      LoginHistory.associate({ User });
      yield User.sync({ alter: true });
      console.log('Таблица "users" успешно синхронизирована.');
      yield Event.sync({ alter: true });
      console.log('Таблица "events" успешно синхронизирована.');
      yield LoginHistory.sync({ alter: true });
      console.log('Таблица "login_history" успешно синхронизирована.');
    } catch (error) {
      console.error('Ошибка при синхронизации таблиц:', error);
    }
  });
export { syncModels };
