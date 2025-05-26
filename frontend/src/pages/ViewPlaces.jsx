import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ViewPlaces() {
  const [places, setPlaces] = useState([]);
  const [searchParams] = useSearchParams();
  const inLocation = searchParams.get('inLocation');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/location/${inLocation}`);
        setPlaces(res.data.places);
      } catch (err) {
        alert(err.response?.data?.message || 'Error fetching places');
      }
    };

    if (inLocation) fetchPlaces();
  }, [inLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-md mt-16 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-pink-700 text-center">
          Places to go from: <span className="text-yellow-700">{inLocation}</span>
        </h2>
        {places.length > 0 ? (
          <ul className="w-full space-y-3">
            {places.map((place) => (
              <li
                key={place._id}
                className="px-4 py-2 bg-pink-100 rounded-md shadow hover:bg-pink-200 transition text-lg text-gray-700"
              >
                {place.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No places found. Add some!</p>
        )}
      </div>
    </div>
  );
}