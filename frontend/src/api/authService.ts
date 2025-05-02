     import axios from "axios";
     const api = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
     export const login = async (email: string, password: string) => {
       try {
         const response = await api.post("/auth/login", { email, password });
         return response.data;
       } catch (error: any) {
         throw new Error(error.response?.data?.message || "Login failed");
       }
     };

     export const register = async (email: string, name:string, password: string) => {
       try {
         const response = await api.post("/auth/register", { email, name, password });
         return response.data;
       } catch (error: any) {
         throw new Error(error.response?.data?.message || "Registration failed");
       }
     };
