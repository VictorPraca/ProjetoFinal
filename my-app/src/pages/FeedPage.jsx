// src/pages/FeedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // <--- Importe o hook useAuth
import '../styles/FeedPage.css';

const FeedPage = () => {
  const { isAuthenticated, user, logout } = useAuth(); // <--- Obtenha isAuthenticated, user e logout do contexto

  return (
    <div>
      <div className="header-container">
        <h1 className='title'>Reddit</h1>  
        {/* Renderização Condicional: Mostra os botões APENAS SE o usuário NÃO estiver autenticado */}
        {!isAuthenticated ? ( // <--- Se NÃO ESTÁ AUTENTICADO
          <div>
            <Link to="/login" className="login-button">Entrar</Link>
            <Link to="/register" className="register-button">Cadastrar-se</Link>
          </div>
        ) : ( // <--- SE ESTÁ AUTENTICADO
          <div className="logged">
            {/* Opcional: Mostrar nome de usuário ou foto */}
            <Link to={`/profile/${user.username}`} className="profile-button">{user && user.profilePicUrl && (
              <img
                src={user.profilePicUrl}
                alt={user.username || 'Avatar'}
                className="profile-header" // Adicione uma classe para estilizar
              />
            )}</Link> 
          </div>
        )}
      </div>
      {
        <p>testando o Feed</p>
      }
    </div>
  );
};

export default FeedPage;