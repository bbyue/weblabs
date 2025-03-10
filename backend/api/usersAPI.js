const { User } = require('../models/user');

const createUser = async (userData) => {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
        throw new Error('Необходимы обязательные поля: name, email, password');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
    }

    return await User.create({ name, email, password });
};

const getAllUsers = async () => {
    return await User.findAll();
};

module.exports = {
    createUser,
    getAllUsers,
};