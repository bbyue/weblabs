import { useState, useEffect, useCallback } from "react";
import { getToken, removeToken } from "../../utils/localStorageUtils";
import styles from "./styles.module.scss";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/public/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.message === "Вы вошли как гость") {
            setUser({ message: data.message });
          } else {
            setUser(data);
          }
          if (!response.ok) {
            if (response.status === 401) {
              window.location.href = "/login";
              return;
            }
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      }
    };

    const token = getToken();
    setIsLoggedIn(!!token);
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/public/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchUserData();
    fetchEvents();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className={styles.pageContainer}>
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
    {isLoggedIn ? (
      <button onClick={handleLogout} className={styles.navButton}>
        Выйти
      </button>
    ) : (
      <>
        <button 
          onClick={() => navigate('/login')} 
          className={styles.navButton}
        >
          Авторизация
        </button>
        <button 
          onClick={() => navigate('/register')} 
          className={styles.navButton}
        >
          Регистрация
        </button>
      </>
    )}
  </div>
</nav>
  
      <div className={styles.userInfo}>
        {user && user.message ? (
          <p className={styles.userMessage}>{user.message}</p>
        ) : (
          <p className={styles.userGreeting}>
            Вы вошли как: <strong>{user?.name || "Гость"}</strong>
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
      {isSearching && (
        <div className={styles.searchIndicator}>Поиск...</div>
      )}
    </section>
  
    <h2 className={styles.sectionTitle}>Мероприятия</h2>
  
    <section className={styles.eventsGrid}>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <article
            className={styles.eventCard}
            key={event.id}
          >
            <h3 className={styles.eventTitle}>{event.title}</h3>
            <p className={styles.eventDescription}>{event.description}</p>
            <time className={styles.eventDate}>
              Дата: {new Date(event.date).toLocaleDateString()}
            </time>
          </article>
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