import { useState, useEffect, useCallback } from "react";
import { getToken, removeToken } from "../../utils/localStorageUtils";
import styles from "./styles.module.scss";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { EventModal } from "../../components/EventModal";
import { EventCard } from "../../components/EventCard";
import {Event} from "../../types/event"

interface User {
  id: number;
  name: string;
  email: string;
}

function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
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
        createdBy: user?.id
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

      await fetchUserData();
      return response.json();
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query.trim() === "") {
        setFilteredEvents(events);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const lowerCaseQuery = query.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerCaseQuery) ||
          event.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredEvents(filtered);
      setIsSearching(false);
    }, 500),
    [events]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      throw new Error("No token found");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        navigate("/login");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await fetchWithAuth("http://localhost:3000/public/me");
      if (!userData?.id) {
        throw new Error("User ID not found");
      }

      setUser(userData);
      setIsLoggedIn(true);
      const eventsData = await fetchWithAuth(
        `http://localhost:3000/private/users/${userData.id}/events`
      );
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (isLoading) {
    return <div className={styles.pageContainer}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>Ошибка: {error}</div>
        <button onClick={fetchUserData}>Попробовать снова</button>
      </div>
    );
  }

  if (!user) {
    return <div className={styles.pageContainer}>Пользователь не найден</div>;
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
            <button 
              onClick={() => navigate('/')} 
              className={styles.logoButton}
            >
              <div className={styles.logoContainer}>
                <img src={logo} alt="Event Manager Logo" className={styles.logo} />
                <h1>Event Manager</h1>
              </div>
            </button>
          </div>
          <div className={styles.navRight}>
            {isLoggedIn && (
              <>
                <button 
                  onClick={() => navigate('/events')} 
                  className={styles.navButton}
                >
                  Все мероприятия
                </button>
                <button 
                  onClick={() => navigate('/account')} 
                  className={styles.navButton}
                >
                  Мой профиль
                </button>
                <button onClick={handleLogout} className={styles.navButton}>
                  Выйти
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className={styles.userProfile}>
        <h2 className={styles.profileTitle}>Мой профиль</h2>
        <div className={styles.profileInfo}>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </section>

      <section className={styles.searchSection}>
        <input
          type="text"
          placeholder="Поиск моих мероприятий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchField}
        />
        {isSearching && (
          <div className={styles.searchIndicator}>Поиск...</div>
        )}
      </section>

      <div className={styles.eventsHeader}>
        <h2 className={styles.sectionTitle}>Мои мероприятия</h2>
        <button onClick={handleCreateEvent} className={styles.navButton}>
          Создать мероприятие
        </button>
      </div>

      <section className={styles.eventsGrid}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={(user as User)?.id}
              creatorName={user.name}
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

export default Account;