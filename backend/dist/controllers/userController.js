import User from "../models/user.js";
import Event from "../models/event.js";
const createUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: "не все обязательные поля указаны" });
        return;
    }
    const hasNumbers = /\d/.test(name);
    if (hasNumbers) {
        res
            .status(400)
            .json({ message: "Имя пользователя не должно содержать цифры" });
        return;
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res
                .status(400)
                .json({ message: "пользователь с таким email уже существует" });
            return;
        }
        const userData = req.body;
        const newUser = await User.create(userData);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при создании пользователя",
            details: error.message,
        });
    }
};
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении пользователей",
            details: error.message,
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: "пользователь не найден" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении пользователя",
            details: error.message,
        });
    }
};
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res
                .status(400)
                .json({ message: "пользователь с таким email уже существует" });
            return;
        }
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            res.status(404).json({ error: "пользователь не найден" });
            return;
        }
        const updatedUser = await User.findByPk(req.params.id);
        const hasNumbers = /\d/.test(name);
        if (hasNumbers) {
            res
                .status(400)
                .json({ message: "Имя пользователя не должно содержать цифры" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при обновлении пользователя",
            details: error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        await Event.destroy({
            where: {
                createdBy: req.params.id,
            },
        });
        const deleted = await User.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            res.status(404).json({ error: "пользователь не найден" });
            return;
        }
        res.status(204).json();
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при удалении пользователя",
            details: error.message,
        });
    }
};
const getUserEvents = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "пользователь не найден" });
            return;
        }
        const events = await Event.findAll({
            where: { createdBy: userId },
            order: [['date', 'DESC']]
        });
        if (!events || events.length === 0) {
            res.status(404).json({ error: "мероприятия не найдены" });
            return;
        }
        res.status(200).json(events);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении мероприятий пользователя",
            details: error.message,
        });
    }
};
export { createUser, getUsers, getUserById, updateUser, deleteUser, getUserEvents };
