import { useState } from 'react';
import {User} from "../types/user"

interface AuthContext {
  isAuth: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuth = (): AuthContext => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
  };

  return {
    isAuth,
    user,
    isLoading,
    login,
    logout,
    setUser
  };
};