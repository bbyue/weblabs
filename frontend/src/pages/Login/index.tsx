     import { useState } from "react";
     import { Link } from "react-router-dom";
     import { useNavigate} from "react-router-dom";
     import { login } from "../../api/authService";
     import { setToken } from "../../utils/localStorageUtils";
     import styles from './styles.module.scss';
     function Login() {
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
       const [error, setError] = useState("");
       const navigate = useNavigate();

       const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         try {
           const data = await login(email, password);
           setToken(data.token); 
           navigate("/events");
         } catch (err: any) {
           setError(err.message || "Login failed");
         }
       };

       return (
         <div>
          <div className={styles.home}>
           <h2>Авторизация</h2>
           {error && <p style={{ color: "red" }}>{error}</p>}
           <form onSubmit={handleSubmit}>
             <label>
               Email:
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </label>
             <label>
               Пароль:
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
             </label>
             <button type="submit">Авторизация</button>
           </form>
           <Link to="/register">Регистрация</Link>
         </div>
         </div>
       );
     }

     export default Login;
