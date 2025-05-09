import { Event } from "../../types/event";
import styles from "./styles.module.scss";

interface EventCardProps {
  event: Event;
  currentUserId?: number;
  creatorName?: string;
  onEdit?: (event: Event) => void;
}

export const EventCard = ({ 
  event, 
  currentUserId, 
  creatorName,
  onEdit 
}: EventCardProps) => {
  const isOwner = currentUserId === event.createdBy;
  const displayCreatorName = creatorName 
    ? creatorName 
    : `Пользователь #${event.createdBy}`;
  
  return (
    <article className={styles.eventCard}>
      <h3 className={styles.eventTitle}>{event.title}</h3>
      <p className={styles.eventDescription}>{event.description}</p>
      <div className={styles.eventMeta}>
        <time className={styles.eventDate}>
          Дата: {new Date(event.date).toLocaleDateString()}
        </time>
        <p className={styles.eventCreator}>
          Создатель: {displayCreatorName}
        </p>
      </div>
      {isOwner && onEdit && (
        <button onClick={() => onEdit(event)} className={styles.editButton}>
          Редактировать
        </button>
      )}
    </article>
  );
};