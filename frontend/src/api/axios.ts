import axios from "axios";

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`
      );
    }
    throw new Error('Network error');
  }
);