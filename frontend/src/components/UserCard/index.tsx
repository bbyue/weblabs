import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/useAuth';
import { Event } from '../../types/event';
import EventCard from '../../components/EventCard';
import EventModal from '../../components/EventModal';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, isAuth } = useAuth();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuth || !user) return;

    const fetchUserEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setUserEvents(data);
      } catch (error) {
        toast.error('Ошибка при загрузке мероприятий');
        console.error('Error fetching user events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [isAuth, user?.id]);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это мероприятие?')) return;

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete event');

      setUserEvents(prev => prev.filter(e => e.id !== eventId));
      toast.success('Мероприятие успешно удалено');
    } catch (error) {
      toast.error('Ошибка при удалении мероприятия');
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveEvent = async (eventData: Event) => {
    try {
      const url = editingEvent 
        ? `http://localhost:3000/events/${editingEvent.id}`
        : 'http://localhost:3000/events';
      
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...eventData,
          userId: user?.id
        })
      });

      if (!response.ok) throw new Error(editingEvent ? 'Failed to update event' : 'Failed to create event');

      const updatedEvent = await response.json();

      setUserEvents(prev => 
        editingEvent
          ? prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
          : [...prev, updatedEvent]
      );

      toast.success(editingEvent 
        ? 'Мероприятие успешно обновлено' 
        : 'Мероприятие успешно создано');
      
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error(editingEvent 
        ? 'Ошибка при обновлении мероприятия' 
        : 'Ошибка при создании мероприятия');
      console.error('Error saving event:', error);
    }
  };

  if (!isAuth) {
    return (
      <div className={styles.notAuth}>
        <h2>Доступ запрещен</h2>
        <p>Пожалуйста, <Link to="/login">войдите</Link> чтобы просмотреть профиль</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.notAuth}>
        <h2>Данные пользователя не загружены</h2>
        <p>Попробуйте перезагрузить страницу</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className={styles.userInfo}>
        <h2>Профиль пользователя</h2>
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button 
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className={styles.createButton}
        >
          Создать новое мероприятие
        </button>
      </div>

      <div className={styles.userEvents}>
        <h3>Мои мероприятия</h3>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : userEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {userEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                editable 
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        ) : (
          <p>Вы еще не создали ни одного мероприятия</p>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        initialData={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default ProfilePage;