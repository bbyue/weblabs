import { __awaiter } from 'tslib';
import User from '../models/user.js';
const createUser = (userData) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      throw new Error('Необходимы обязательные поля: name, email, password');
    }
    const existingUser = yield User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }
    return yield User.create({
      name,
      email,
      password,
      createdAt: new Date(),
    });
  });
const getAllUsers = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findAll();
  });
const deleteUser = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByPk(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    yield user.destroy();
    return { message: 'Пользователь успешно удален' };
  });
export { createUser, getAllUsers, deleteUser };
