import React, { useState } from 'react';
import AppRouter from './routes/router';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  return (
    <AppRouter token={token} setToken={setToken} />
  );
};

export default App;