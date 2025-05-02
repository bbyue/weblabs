import { useAuth } from '../AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <div>
          <span>Welcome, {user.email}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
};

export default Header;