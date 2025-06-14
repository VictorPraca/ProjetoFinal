// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Seu componente App
import './index.css'; // Seu CSS global (se tiver)

// IMPORTANTE: Importe o AuthProvider e o BrowserRouter
import { AuthProvider } from './contexts/AuthContext.jsx'; // <--- Verifique o caminho!
import { BrowserRouter } from 'react-router-dom'; // <--- Verifique o caminho!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O BrowserRouter DEVE envolver tudo que usa roteamento, incluindo o AuthProvider e o App */}
    <BrowserRouter>
      {/* O AuthProvider DEVE envolver seu componente App para que o useAuth funcione em qualquer lugar */}
      <AuthProvider>
        <App /> {/* Seu componente App principal */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);