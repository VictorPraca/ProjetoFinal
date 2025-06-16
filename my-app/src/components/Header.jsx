// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import '../styles/Header.css'; // Importa seus estilos CSS para o Header

const BASE_BACKEND_URL = 'http://localhost:5000'; 
const DEFAULT_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; 

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const profileImageUrl = isAuthenticated && user?.profilePicture 
    ? `${BASE_BACKEND_URL}${user.profilePicture}` 
    : DEFAULT_PROFILE_PIC;

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <header className="app-header"> {/* Container principal do header */}
        {/* Grupo da esquerda: Botão do menu e título */}
        <div className="header-left-group">
          <button className="menu-toggle-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className='title'>Tidder</h1>
        </div>

        {/* Renderização Condicional do lado direito do header */}
        {!isAuthenticated ? ( // Se o usuário NÃO ESTÁ AUTENTICADO
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Entrar</Link>
            <Link to="/register" className="register-button">Cadastrar-se</Link>
          </div>
        ) : ( // Se o usuário ESTÁ AUTENTICADO
          <div className="logged-in-actions"> {/* ESTE É O CONTAINER DA DIREITA */}
            {/* Botão: Criar Postagem */}
            <Link to="/create-post" className="create-post-header-button">
              + Criar Post
            </Link>
            
            {/* Container da foto de perfil e dropdown */}
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <Link to="#" onClick={toggleDropdown} className="profile-link-wrapper">
                <img
                  src={profileImageUrl}
                  alt={user?.username || 'Avatar'}
                  className="header-profile-pic" /* <-- CLASSE PRINCIPAL DA FOTO DE PERFIL */
                />
              </Link>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <ul>
                    <li><Link to={`/profile/${user?.username}`} onClick={toggleDropdown} className="dropdown-item">Perfil</Link></li>
                    <li><button onClick={() => { logout(); toggleDropdown(); }} className="dropdown-item">Sair</button></li>
                  </ul>
                </div>
              )}
            </div> 
          </div>
        )}
      </header>
    </>
  );
};

export default Header;