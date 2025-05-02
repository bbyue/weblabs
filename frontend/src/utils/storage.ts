const TOKEN_KEY = "authToken";
const USERNAME_KEY = "userName";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserName = (): string | null => {
  return localStorage.getItem(USERNAME_KEY);
};

export const setUserName = (name: string): void => {
  localStorage.setItem(USERNAME_KEY, name);
};

export const removeUserName = (): void => {
  localStorage.removeItem(USERNAME_KEY);
};

export const setAuthData = (token: string, name: string): void => {
  setToken(token);
  setUserName(name);
};

export const clearAuthData = (): void => {
  removeToken();
  removeUserName();
};