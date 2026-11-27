import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { roleLabel } from '../roles';

const links = {
  ADMIN: [
    ['/admin', 'Dashboard'],
    ['/admin/users', 'Users'],
    ['/admin/stores', 'Stores'],
  ],
  USER: [
    ['/stores', 'Stores'],
    ['/password', 'Change Password'],
  ],
  STORE_OWNER: [
    ['/owner', 'Dashboard'],
    ['/password', 'Change Password'],
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">Store Rating</span>
      <div className="nav-links">
        {links[user.role].map(([to, label]) => (
          <NavLink key={to} to={to} end>
            {label}
          </NavLink>
        ))}
      </div>
      <div className="nav-user">
        <span>
          {user.name} ({roleLabel[user.role]})
        </span>
        <button className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
