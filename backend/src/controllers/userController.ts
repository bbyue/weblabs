import User from "../models/user.js";
import Event from "../models/event.js";
import { Request, Response } from "express";
//import * as dotenv from "dotenv";
//dotenv.config();

const createUser = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(400).json({
      error: "ошибка при создании пользователя",
      details: (error as Error).message,
    });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении пользователей",
      details: (error as Error).message,
    });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ error: "пользователь не найден" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении пользователя",
      details: (error as Error).message,
    });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(400).json({
      error: "ошибка при обновлении пользователя",
      details: (error as Error).message,
    });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await Event.destroy({
      where:{
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
  } catch (error) {
    res.status(400).json({
      error: "ошибка при удалении пользователя",
      details: (error as Error).message,
    });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
