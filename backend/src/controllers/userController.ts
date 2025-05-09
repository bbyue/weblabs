import User from "../models/user.js";
import Event from "../models/event.js";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, gender, birthDate } = req.body;

  if (!firstName || !lastName || !email || !gender || !birthDate) {
    res.status(400).json({ message: "не все обязательные поля указаны" });
    return;
  }

  // Validate first name and last name
  const nameHasNumbers = (name: string): boolean => /\d/.test(name);
  if (nameHasNumbers(firstName) || nameHasNumbers(lastName)) {
    res.status(400).json({ message: "Имя пользователя не должно содержать цифры" });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "пользователь с таким email уже существует" });
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
  const { firstName, lastName, email } = req.body;

  try {
    // Validate names first
    const nameHasNumbers = (name: string): boolean => /\d/.test(name);
    if (firstName && nameHasNumbers(firstName)) {
      res.status(400).json({ message: "Имя пользователя не должно содержать цифры" });
      return;
    }
    if (lastName && nameHasNumbers(lastName)) {
      res.status(400).json({ message: "Фамилия пользователя не должна содержать цифры" });
      return;
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== parseInt(req.params.id)) {
        res.status(400).json({ message: "пользователь с таким email уже существует" });
        return;
      }
    }

    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      res.status(404).json({ error: "пользователь не найден" });
      return;
    }
    const updatedUser = await User.findByPk(req.params.id);
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
  } catch (error) {
    res.status(400).json({
      error: "ошибка при удалении пользователя",
      details: (error as Error).message,
    });
  }
};

const getUserEvents = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении мероприятий пользователя",
      details: (error as Error).message,
    });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser, getUserEvents };