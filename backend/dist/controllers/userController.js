import User from "../models/user.js";
import Event from "../models/event.js";
//import * as dotenv from "dotenv";
//dotenv.config();
const createUser = async (req, res) => {
    const { name, email } = req.body;
    // проверка обязательных данных
    if (!name || !email) {
        res.status(400).json({ message: "не все обязательные поля указаны" });
        return;
    }
    // Дополнительная проверка: имя не должно содержать цифры
    const hasNumbers = /\d/.test(name);
    if (hasNumbers) {
        res
            .status(400)
            .json({ message: "Имя пользователя не должно содержать цифры" });
        return;
    }
    try {
        // проверка уникальности email
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
        // проверка уникальности email
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
        res.status(204).json(); // No content
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при удалении пользователя",
            details: error.message,
        });
    }
};
export { createUser, getUsers, getUserById, updateUser, deleteUser };
