import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authService";
import { getToken, setToken } from "../../utils/localStorageUtils";
import styles from './styles.module.scss';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/events"); 
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToken(data.token); 
      navigate("/events");
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    }
  };

  if (isCheckingAuth) {
    return <div className={styles.loading}>Проверка авторизации...</div>;
  }

  return (
    <div className={styles.home}>
      <h2>Авторизация</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Пароль:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          Авторизация
        </button>
      </form>
      <div className={styles.registerLink}>
        Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}

export default Login;