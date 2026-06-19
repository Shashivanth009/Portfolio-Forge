import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';

// Configure axios base URL. Uses VITE_API_BASE_URL environment variable if set,
// otherwise defaults to relative URL on local or http://localhost:5000 in production
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
axios.defaults.baseURL = (import.meta as any).env?.VITE_API_BASE_URL || (isLocal ? '' : 'http://localhost:5000');


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

