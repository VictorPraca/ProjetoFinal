import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import CommunitiesPage from './pages/CommunitiesPage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import MessagesPage from './pages/MessagesPage.jsx';
import CommunityDetailPage from './pages/CommunityDetailPage.jsx';

import ProtectedRoute from './components/ProtectedRoutes';
import CreatePost from './components/CreatePost.jsx';


const AppRoutes = () => {

  return ( 
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
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
                    <MessagesPage /> 
                </ProtectedRoute>
            }
      />

      <Route 
             path="/community/:groupId"
              element={
                  <ProtectedRoute>
                      <CommunityDetailPage /> 
                  </ProtectedRoute>
            } 
      />
      <Route 
              path="/create-post"
              element={
                  <ProtectedRoute>
                        <CreatePost /> 
                  </ProtectedRoute>
              } 
          />

      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;