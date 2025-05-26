import React, { useState } from "react";
import api from "../api";

export default function AddPlace({ locationName, onSuccess, onCancel }) {
  const [placeName, setPlaceName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/location/add", { locationName, placeName });
      onSuccess();
    } catch (err) {
      setError("Failed to add place");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add new place to go from {locationName}</h3>
      <input
        type="text"
        placeholder="Place name"
        value={placeName}
        onChange={e => setPlaceName(e.target.value)}
        required
      />
      <button type="submit">Add</button>
      <button type="button" onClick={onCancel}>Cancel</button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}
