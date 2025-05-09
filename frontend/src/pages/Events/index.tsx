import { useState, useEffect } from "react";
import { getToken, removeToken } from "../../utils/localStorageUtils";
import styles from "./styles.module.scss";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { Event } from "../../types/event";
import { EventModal } from "../../components/EventModal";
import { EventCard } from "../../components/EventCard";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | { message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [usersMap, setUsersMap] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmitEvent = async (formData: Omit<Event, 'id' | 'createdBy'>) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        throw new Error("Authorization token missing");
      }

      const apiData = {
        ...formData,
        createdBy: currentEvent?.createdBy || (user as User)?.id
      };

      const url = currentEvent 
        ? `http://localhost:3000/private/events/${currentEvent.id}`
        : "http://localhost:3000/private/events";
      
      const method = currentEvent ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save event");
      }
      await fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/public/events");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError("Не удалось загрузить мероприятия");
    }
  };

  const fetchUserData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/public/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.message === "Вы вошли как гость") {
        setUser({ message: data.message });
      } else {
        setUser(data);
      }
      
      if (!response.ok && response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:3000/public/users", {
        headers
      });

      if (!response.ok) {
        if (response.status === 401 && token) {
          removeToken();
          navigate("/login");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const users = await response.json();
      const usersMapping = users.reduce((acc: Record<number, string>, user: User) => {
        acc[user.id] = `${user.firstName} ${user.lastName}`;
        return acc;
      }, {});

      setUsersMap(usersMapping);
      return usersMapping;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsersMap({});
      return {};
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const token = getToken();
      setIsLoggedIn(!!token);

      try {
        await fetchUserData();
        await Promise.all([fetchUsers(), fetchEvents()]);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEvent}
        initialData={currentEvent}
      />

      <header className={styles.siteHeader}>
        <nav className={styles.navigationBar}>
          <div className={styles.navLeft}>
            <button onClick={() => navigate('/')} className={styles.logoButton}>
              <div className={styles.logoContainer}>
                <img src={logo} alt="Event Manager Logo" className={styles.logo} />
                <h1>Event Manager</h1>
              </div>
            </button>
          </div>
          <div className={styles.navRight}>
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate('/account')} className={styles.navButton}>
                  Мой профиль
                </button>
                <button onClick={handleLogout} className={styles.navButton}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className={styles.navButton}>
                  Авторизация
                </button>
                <button onClick={() => navigate('/register')} className={styles.navButton}>
                  Регистрация
                </button>
              </>
            )}
          </div>
        </nav>

        <div className={styles.userInfo}>
          {user && 'message' in user ? (
            <p className={styles.userMessage}>{user.message}</p>
          ) : (
            <p className={styles.userGreeting}>
              Вы вошли как: <strong>{(user as User)?.firstName || "Гость"}</strong>
            </p>
          )}
        </div>
      </header>

      <section className={styles.searchSection}>
        <input
          type="text"
          placeholder="Поиск мероприятий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchField}
        />
      </section>

      {isLoggedIn && (
        <button onClick={handleCreateEvent} className={styles.navButton}>
          Создать мероприятие
        </button>
      )}

      <h2 className={styles.sectionTitle}>Мероприятия</h2>
      
      <section className={styles.eventsGrid}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={(user as User)?.id}
              creatorName={usersMap[event.createdBy]}
              onEdit={handleEditEvent}
            />
          ))
        ) : (
          <p className={styles.noEventsMessage}>
            {searchQuery.trim() ? "Ничего не найдено" : "Нет мероприятий"}
          </p>
        )}
      </section>
    </div>
  );
}

export default Events;