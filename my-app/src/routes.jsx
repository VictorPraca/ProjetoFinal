// src/routes.jsx (CORRIGIDO)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe suas páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Importe o componente para proteger rotas (ESSENCIAL!)
import ProtectedRoute from './components/ProtectedRoutes';


const AppRoutes = () => {
  // AQUI ESTÁ A CORREÇÃO:
  return ( // <--- ADICIONE ESTE PARÊNTESE DE ABERTURA AQUI!
    <Routes>
      {/* Rotas Públicas (não precisam de proteção) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Protegidas - O usuário precisa estar logado para acessá-las */}
      {/* Envolva a FeedPage com ProtectedRoute */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      {/* Envolva a ProfilePage com ProtectedRoute */}
      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Adicione outras rotas protegidas aqui */}

      {/* Rota curinga para 404 (página não encontrada) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  ); // E o parêntese de fechamento já está no final
};

export default AppRoutes;