// src/routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe suas páginas (que você criará em src/pages/)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage'; // Página que o usuário verá após logar
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';// Uma página simples para 404

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Principais (Protegidas ou Abertas, dependendo do design) */}
        <Route path="/feed" element={<FeedPage />} /> {/* Página inicial após login */}
        <Route path="/profile/:username" element={<ProfilePage />} />
        {/* Adicione outras rotas conforme o projeto avança */}

        {/* Rota curinga para 404 (página não encontrada) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;