import React, { useEffect, useState } from "react";
import api from "../api";
import AddPlace from "./AddPlace";

export default function PlacesList({ locationName, onBack }) {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const fetchPlaces = async () => {
    try {
      const res = await api.get(`/location/${locationName}`);
      setPlaces(res.data.places);
    } catch (err) {
      setError("Failed to load places");
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [locationName]);

  const handleAddPlaceSuccess = () => {
    setShowAdd(false);
    fetchPlaces();
  };

  return (
    <div>
      <h2>Places to go from {locationName}</h2>
      <button onClick={onBack}>Back</button>
      {error && <p style={{color:"red"}}>{error}</p>}
      <ul>
        {places.length === 0 && <li>No places yet</li>}
        {places.map(p => (
          <li key={p._id}>{p.name}</li>
        ))}
      </ul>
      {showAdd ? (
        <AddPlace locationName={locationName} onSuccess={handleAddPlaceSuccess} onCancel={() => setShowAdd(false)} />
      ) : (
        <button onClick={() => setShowAdd(true)}>Add new place</button>
      )}
    </div>
  );
}
