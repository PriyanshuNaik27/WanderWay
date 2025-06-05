// src/pages/ViewPlaces.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ViewPlaces() {
  const [places, setPlaces] = useState([]);
  const [searchParams] = useSearchParams();
  const inLocation = searchParams.get('inLocation');
  const [newPlace, setNewPlace] = useState('');
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [reviewError, setReviewError] = useState({});
  const [addPlaceError, setAddPlaceError] = useState('');
  const [addPlaceLoading, setAddPlaceLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [lastPlaceId, setLastPlaceId] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  // Fetch places for this location
  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/location/${inLocation}`);
      setPlaces(res.data.places);
    } catch (err) {
      setPlaces([]);
    }
  };

  useEffect(() => {
    if (inLocation) fetchPlaces();
    // eslint-disable-next-line
  }, [inLocation]);

  // Add new place
  const handleAddPlace = async (e) => {
    e.preventDefault();
    setAddPlaceLoading(true);
    setAddPlaceError('');
    try {
      const res = await axios.post(
        `${apiUrl}/api/location/add`,
        { locationName: inLocation, placeName: newPlace },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastPlaceId(res.data.place?._id); // Backend should return the new place object
      setShowReviewForm(true);
      setNewPlace('');
      fetchPlaces();
    } catch (err) {
      setAddPlaceError(err.response?.data?.message || 'Error adding place');
    } finally {
      setAddPlaceLoading(false);
    }
  };

  // Add review for new place (after adding)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiUrl}/api/location/place/${lastPlaceId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowReviewForm(false);
      setRating('');
      setComment('');
      fetchPlaces();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding review');
    }
  };

  // Handle review input changes per place
  const handleReviewInput = (placeId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [placeId]: {
        ...prev[placeId],
        [field]: value,
      },
    }));
  };

  // Submit review for a place
  const handleReviewSubmitExisting = async (placeId) => {
    setReviewLoading((prev) => ({ ...prev, [placeId]: true }));
    setReviewError((prev) => ({ ...prev, [placeId]: '' }));
    try {
      const { rating = '', comment = '' } = reviewInputs[placeId] || {};
      await axios.post(
        `${apiUrl}/api/location/place/${placeId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPlaces();
      setReviewInputs((prev) => ({ ...prev, [placeId]: { rating: '', comment: '' } }));
    } catch (err) {
      setReviewError((prev) => ({
        ...prev,
        [placeId]: err.response?.data?.message || 'Error adding review',
      }));
    } finally {
      setReviewLoading((prev) => ({ ...prev, [placeId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-md mt-16 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-pink-700 text-center">
          Places to go from: <span className="text-yellow-700">{inLocation}</span>
        </h2>
        {/* Add Place Form */}
        <form onSubmit={handleAddPlace} className="w-full flex flex-col gap-4 mb-6">
          <input
            value={newPlace}
            onChange={e => setNewPlace(e.target.value)}
            placeholder="Add a new place..."
            required
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full py-2 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition"
            disabled={addPlaceLoading}
          >
            {addPlaceLoading ? 'Adding...' : 'Add Place'}
          </button>
          {addPlaceError && <div className="text-red-500 text-sm">{addPlaceError}</div>}
        </form>
        {/* Add Review for New Place */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="w-full flex flex-col gap-4 mb-6">
            <h3 className="text-lg font-semibold text-pink-700 mb-2">Add a Review for your new place:</h3>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={e => setRating(e.target.value)}
              placeholder="Rating (1-5)"
              required
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Comment"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Submit Review
            </button>
          </form>
        )}
        {/* List of Places */}
        {places.length > 0 ? (
          <ul className="w-full space-y-6">
            {places.map((place) => (
              <li
                key={place._id}
                className="px-4 py-2 bg-pink-100 rounded-md shadow text-lg text-gray-700"
              >
                <div className="font-semibold">{place.name}</div>
                {/* Reviews */}
                <div className="mt-2">
                  <div className="text-sm font-medium text-pink-700 mb-1">Reviews:</div>
                  {place.reviews && place.reviews.length > 0 ? (
                    <ul className="mb-2 space-y-1">
                      {place.reviews.map((review, idx) => (
                        <li key={idx} className="text-gray-700 text-sm bg-white rounded px-2 py-1">
                          <span className="font-semibold text-yellow-700">★ {review.rating}</span>
                          {review.comment && <> — <span>{review.comment}</span></>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm mb-2">No reviews yet.</div>
                  )}
                </div>
                {/* Add Review for existing place */}
                {token && (
                  <div className="mt-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rating"
                        value={reviewInputs[place._id]?.rating || ''}
                        onChange={e => handleReviewInput(place._id, 'rating', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Comment"
                        value={reviewInputs[place._id]?.comment || ''}
                        onChange={e => handleReviewInput(place._id, 'comment', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleReviewSubmitExisting(place._id)}
                        disabled={reviewLoading[place._id]}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm"
                      >
                        {reviewLoading[place._id] ? 'Adding...' : 'Add Review'}
                      </button>
                    </div>
                    {reviewError[place._id] && (
                      <div className="text-red-500 text-xs mt-1">{reviewError[place._id]}</div>
                    )}
                  </div>
                )}
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