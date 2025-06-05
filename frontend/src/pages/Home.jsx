// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  const [inLocation, setInLocation] = useState('');
  const [randomLocations, setRandomLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRandomLocations() {
      try {
        const res = await axios.get(`${apiUrl}/api/location/random-locations`);
        setRandomLocations(Array.isArray(res.data.locations) ? res.data.locations : []);
      } catch {
        setRandomLocations([]);
      }
    }
    fetchRandomLocations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inLocation.trim()) {
      navigate(`/view-places?inLocation=${encodeURIComponent(inLocation)}`);
    }
  };

  const handleRandomLocationClick = (name) => {
    navigate(`/view-places?inLocation=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-md mt-16 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Enter a location you are at:</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={inLocation}
            onChange={(e) => setInLocation(e.target.value)}
            placeholder="e.g., IIT Guwahati"
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            Show Places
          </button>
        </form>
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold text-indigo-600 mb-3">Random Locations:</h3>
          <ul className="space-y-2">
            {randomLocations.length === 0 && (
              <li className="text-gray-500">No locations found.</li>
            )}
            {randomLocations.map((loc) => (
              <li
                key={loc._id}
                className="bg-indigo-100 px-4 py-2 rounded shadow text-indigo-800 font-medium cursor-pointer hover:bg-indigo-200 transition"
                onClick={() => handleRandomLocationClick(loc.name)}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}