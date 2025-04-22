import { Request, Response, NextFunction } from 'express';
import { createUser, deleteUser, getAllUsers } from '@api/usersAPI';

interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
}

export const createNewUser = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    CreateUserRequestBody
  >,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const result = await deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      const status = error.message === 'User not found' ? 404 : 500;
      res.status(status).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
