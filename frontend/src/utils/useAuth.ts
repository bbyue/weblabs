import { useState, useEffect } from 'react';
import { getToken, removeToken, setToken, getUserName, removeUserName } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const name = getUserName() || '';
      setIsAuth(!!token);
      setUserName(name);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (token: string, name: string) => {
    setToken(token);
    setUserName(name);
    setIsAuth(true);
    setUserName(name);
    navigate('/events');
  };

  const logout = () => {
    removeToken();
    removeUserName();
    setIsAuth(false);
    setUserName('');
    navigate('/login');
  };

  return { 
    isAuth, 
    userName, 
    isLoading,
    login,
    logout,
    setAuth: setIsAuth,
    setUser: setUserName
  };
};