import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
const apiUrl = import.meta.env.VITE_API_URL;

export default function AddPlace() {
  const [inLocation, setInLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/location/add`,
        { locationName: inLocation, placeName: toLocation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Location added!');
      setInLocation('');
      setToLocation('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding place');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-md mt-16 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Add a Place to Go</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            value={inLocation}
            onChange={(e) => setInLocation(e.target.value)}
            placeholder="You are at..."
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="Place to go..."
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}