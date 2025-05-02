import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import styles from './styles.module.scss';
import logo from './logo.png';

export const Home = () => {
  const { isAuth, userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Event Manager Logo" className={styles.logo} />
            <h1>Event Manager</h1>
          </div>
          
          <nav className={styles.nav}>
            {isAuth ? (
              <div className={styles.userPanel}>
                <span className={styles.userGreeting}>Добро пожаловать, <strong>{userName}</strong></span>
                <button 
                  onClick={handleLogout} 
                  className={`${styles.button} ${styles.logoutButton}`}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/login" className={styles.button}>Войти</Link>
                <Link to="/register" className={`${styles.button} ${styles.registerButton}`}>Регистрация</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h2>Платформа для управления мероприятиями</h2>
          <p className={styles.description}>
            Организуйте мероприятия и отслеживайте события в одном месте.
          </p>
          
          <div className={styles.actions}>
            {isAuth ? (
              <Link to="/events" className={`${styles.button} ${styles.primaryButton}`}>
                Перейти к мероприятиям
              </Link>
            ) : (
              <Link to="/events" className={`${styles.button} ${styles.primaryButton}`}>
                Посмотреть мероприятия
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;