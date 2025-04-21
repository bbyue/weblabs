var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from './models/user.js';
import Event from './models/event.js';
import LoginHistory from './models/loginHistory.js';
const syncModels = () => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.error('Ошибка при синхронизации таблиц:', error);
    }
});
export { syncModels };
