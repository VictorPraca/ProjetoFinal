// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importe seu hook de autenticação

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Assume que useAuth fornece isAuthenticated e loading

  // Se ainda estiver carregando (verificando o token), mostre um indicador de carregamento
  if (loading) {
    return <div>Carregando autenticação...</div>; // Ou um spinner mais elaborado
  }

  // Se não estiver autenticado, redirecione para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderize os componentes filhos (a página protegida)
  return children;
};

export default ProtectedRoute;