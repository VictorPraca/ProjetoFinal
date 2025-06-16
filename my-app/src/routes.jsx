// src/routes.jsx (CORRIGIDO)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe suas páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import CommunitiesPage from './pages/CommunitiesPage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import MessagesPage from './pages/MessagesPage.jsx';
import CommunityDetailPage from './pages/CommunityDetailPage.jsx';

// Importe o componente para proteger rotas (ESSENCIAL!)
import ProtectedRoute from './components/ProtectedRoutes';
import CreatePost from './components/CreatePost.jsx';


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
      
      <Route
            path="/communities"
            element={
                <ProtectedRoute>
                    <CommunitiesPage />
                </ProtectedRoute>
            }
      />

      <Route
            path="/messages"
            element={
                <ProtectedRoute>
                    <MessagesPage /> {/* <--- Nova rota */}
                </ProtectedRoute>
            }
      />

      <Route // <--- O ERRO PODE ESTAR NO INÍCIO DESTA LINHA OU NOS ATRIBUTOS
            path="/community/:groupId"
            element={
                <ProtectedRoute>
                    <CommunityDetailPage /> {/* <--- OU ALGUM PROBLEMA NESTA LINHA DO COMPONENTE */}
                </ProtectedRoute>
            } // <--- OU NO FECHAMENTO DAS CHAVES/PARÊNTESES AQUI
        />
<Route // <--- O ERRO PODE ESTAR NO INÍCIO DESTA LINHA OU NOS ATRIBUTOS
            path="/create-post"
            element={
                <ProtectedRoute>
                    <CreatePost /> {/* <--- OU ALGUM PROBLEMA NESTA LINHA DO COMPONENTE */}
                </ProtectedRoute>
            } // <--- OU NO FECHAMENTO DAS CHAVES/PARÊNTESES AQUI
        />

      

      {/* Rota curinga para 404 (página não encontrada) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  ); // E o parêntese de fechamento já está no final
};

export default AppRoutes;