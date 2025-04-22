import { __awaiter } from 'tslib';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error(
    'Missing required database configuration in environment variables',
  );
}
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});
const authenticateDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield sequelize.authenticate();
      console.log('Соединение с базой данных успешно установлено.');
    } catch (error) {
      console.error('Не удалось подключиться к базе данных:', error);
    }
  });
export { sequelize, authenticateDB };
