export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string;
    owner: string;
  }
  export interface EventCardProps {
    event: Event;
    editable?: boolean;
    onEdit?: (event: Event) => void;
    onDelete?: (eventId: number) => void;
  }