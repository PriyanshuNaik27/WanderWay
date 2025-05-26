// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/add-place">Add Place</Link> |{" "}
      <Link to="/view-places">View Places</Link> |{" "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
