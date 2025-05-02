import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void; 
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await fetch('/auth/logout', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          console.error('Ошибка при инвалидации refresh token:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса на выход:', error);
      }
    }
    onLogout();
  };

  return (
    <button onClick={handleLogout}>Выйти</button>
  );
};

export default LogoutButton;
