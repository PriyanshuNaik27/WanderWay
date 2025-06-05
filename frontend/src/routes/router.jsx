// src/routes/router.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ViewPlaces from '../pages/ViewPlaces';

const AppRouter = ({ token, setToken }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/view-places" element={token ? <ViewPlaces /> : <Navigate to="/login" />} />
        <Route path="*" element={<div className="p-8 text-center text-xl text-red-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;