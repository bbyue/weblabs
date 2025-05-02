import React from 'react';
import { Event } from '../../types/event';
import styles from './styles.module.scss';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date).toLocaleDateString();

  return (
    <div className={styles.card}>
      {event.image && (
        <div className={styles.imageContainer}>
          <img src={event.image} alt={event.title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.date}>{eventDate}</p>
        <p className={styles.location}>{event.location}</p>
        <p className={styles.description}>{event.description}</p>
      </div>
    </div>
  );
};