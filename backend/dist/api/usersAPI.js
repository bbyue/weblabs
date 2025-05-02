import User from '../models/user.js';
const createUser = async (userData) => {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
        throw new Error('Необходимы обязательные поля: name, email, password');
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
    }
    return await User.create({
        name,
        email,
        password,
        createdAt: new Date(),
    });
};
const getAllUsers = async () => {
    return await User.findAll();
};
const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }
    await user.destroy();
    return { message: 'Пользователь успешно удален' };
};
export { createUser, getAllUsers, deleteUser };
