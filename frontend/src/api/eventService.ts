import { api } from "./axios";

export const EventService = {
  async getAll() {
    const { data } = await api.get("/events");
    return data;
  },
};