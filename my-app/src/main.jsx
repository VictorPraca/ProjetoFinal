// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // <--- O caminho está correto?
import './index.css'; // Ou o nome do seu CSS global

// Certifique-se de que 'root' é o ID correto do seu div no index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* <--- App está sendo renderizado aqui? */}
  </React.StrictMode>,
);
