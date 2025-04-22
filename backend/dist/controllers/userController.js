import { __awaiter } from 'tslib';
import { createUser, deleteUser, getAllUsers } from '../api/usersAPI.js';
export const createNewUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const newUser = yield createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
export const getUsers = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const users = yield getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
export const removeUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }
      const result = yield deleteUser(userId);
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
  });
