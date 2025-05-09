import { useState, useEffect, useCallback } from "react";
import { getToken, removeToken } from "../../utils/localStorageUtils";
import styles from "./styles.module.scss";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { EventModal } from "../../components/EventModal";
import { EventCard } from "../../components/EventCard";
import { Event } from "../../types/event";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
}

function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUserForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editedUser?.firstName?.trim()) {
      errors.firstName = 'Имя обязательно';
    }
    if (!editedUser?.lastName?.trim()) {
      errors.lastName = 'Фамилия обязательна';
    }
    if (!editedUser?.email?.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/^\S+@\S+\.\S+$/.test(editedUser.email)) {
      errors.email = 'Некорректный email';
    }
    if (!editedUser?.birthDate) {
      errors.birthDate = 'Дата рождения обязательна';
    } else if (new Date(editedUser.birthDate) > new Date()) {
      errors.birthDate = 'Дата рождения не может быть в будущем';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateUserForm() || !editedUser || !user) return;

    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/private/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении профиля');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      setEditedUser(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Ошибка при сохранении профиля');
    }
  };

  // Data fetching
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
      setEditedUser(userData);
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

  // Search functionality
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
        <button onClick={fetchUserData} className={styles.retryButton}>
          Попробовать снова
        </button>
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
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Мой профиль</h2>
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)} 
              className={styles.navButton}
            >
              Редактировать
            </button>
          ) : (
            <div className={styles.profileActions}>
              <button 
                onClick={handleSaveProfile}
                className={styles.navButton}
              >
                Сохранить
              </button>
              <button 
                onClick={() => {
                  setEditMode(false);
                  setValidationErrors({});
                }}
                className={styles.closeButton}
              >
                Отмена
              </button>
            </div>
          )}
        </div>

        {editMode ? (
          <div className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label>Фамилия*</label>
              <input
                type="text"
                name="lastName"
                value={editedUser?.lastName || ''}
                onChange={handleInputChange}
                className={validationErrors.lastName ? styles.errorInput : ''}
              />
              {validationErrors.lastName && (
                <span className={styles.errorText}>{validationErrors.lastName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Имя*</label>
              <input
                type="text"
                name="firstName"
                value={editedUser?.firstName || ''}
                onChange={handleInputChange}
                className={validationErrors.firstName ? styles.errorInput : ''}
              />
              {validationErrors.firstName && (
                <span className={styles.errorText}>{validationErrors.firstName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Отчество</label>
              <input
                type="text"
                name="middleName"
                value={editedUser?.middleName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={editedUser?.email || ''}
                onChange={handleInputChange}
                className={validationErrors.email ? styles.errorInput : ''}
              />
              {validationErrors.email && (
                <span className={styles.errorText}>{validationErrors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Пол*</label>
              <select
                name="gender"
                value={editedUser?.gender || ''}
                onChange={handleInputChange}
              >
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Дата рождения*</label>
              <input
                type="date"
                name="birthDate"
                value={editedUser?.birthDate || ''}
                onChange={handleInputChange}
                className={validationErrors.birthDate ? styles.errorInput : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {validationErrors.birthDate && (
                <span className={styles.errorText}>{validationErrors.birthDate}</span>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <p><strong>ФИО:</strong> {user.lastName} {user.firstName} {user.middleName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Пол:</strong> {
              user.gender === 'male' ? 'Мужской' : 
              user.gender === 'female' ? 'Женский' : 'Другой'
            }</p>
            <p><strong>Дата рождения:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
          </div>
        )}
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
              currentUserId={user.id}
              creatorName={`${user.firstName} ${user.lastName}`}
              onEdit={handleEditEvent}
            />
          ))
        ) : (
          <p className={styles.noEventsMessage}>
            {searchQuery.trim() ? "Ничего не найдено" : "Вы еще не создали мероприятий"}
          </p>
        )}
      </section>
    </div>
  );
}

export default Account;