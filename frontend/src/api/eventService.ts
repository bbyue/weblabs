import { api } from "./axios";
export class EventService {
  private token: string | null;

  constructor(token: string | null) {
    this.token = token;
  }

  async fetchEvents(): Promise<Event[]> {
    const response = await fetch('/api/events', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }
}