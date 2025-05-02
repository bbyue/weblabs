     import { useState, useEffect } from "react";
     import { getToken, removeToken } from "../../utils/localStorageUtils";
     import styles from "./styles.module.scss";
     import { Link, useNavigate } from "react-router-dom";
     import LogoutButton from "../../components/LogoutButton"; 
     interface Event {
       id: number;
       title: string;
       description: string;
       date: string;
     }

     function Events() {
       const [events, setEvents] = useState<Event[]>([]);
       const [isLoggedIn, setIsLoggedIn] = useState(false);
       const [user, setUser] = useState<any>(null); 
       const navigate = useNavigate();
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
              if(data.message === 'Вы вошли как гость'){
                  setUser({message: data.message});
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
        
         <div>
           <div className={styles.header}>
           <div className={styles.headertop}>
           {isLoggedIn ? ( 
          <LogoutButton onLogout={handleLogout} />
        ) : (
          <>
            <Link to="/login" className={styles.linka}>Авторизация</Link>
            <Link to="/register" className={styles.linka}>Регистрация</Link>
          </>
        )}
           <Link to="/events" className={styles.linka}>Мероприятия</Link>
           </div>
             
           <div>
       
        {user && user.message ? <p> {user.message}</p> : <p>Вы вошли как: {user?.email || 'Гость'}</p>}
        
    </div>
          </div>
           <h2 className={styles.hh1}>Мероприятия</h2>
         
           <div  style={{ display: "flex", flexWrap: "wrap" }}>
             {events.map((event) => (
               <div className={styles.em}
                 key={event.id}
                 style={{ border: "1px solid #ccc", margin: "10px", padding: "10px", width: "200px" }}
               >
                 <h3>{event.title}</h3>
                 <p>{event.description}</p>
                 <p>Date: {event.date}</p>
               </div>
             ))}
           </div>
         </div>
       );
     }

     export default Events;
