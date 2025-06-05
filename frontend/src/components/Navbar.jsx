// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3 mb-8">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-lg font-semibold text-indigo-700 hover:text-indigo-900 transition">Home</Link>
        {token && (
          <>
            <Link to="/view-places" className="text-lg text-indigo-700 hover:text-indigo-900 transition">View Places</Link>
          </>
        )}
      </div>
      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition font-semibold"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded transition font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}