import React, { useState, useRef, useEffect } from 'react'; // Importa useState, useRef, useEffect
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Para verificar autenticação
import Sidebar from './Sidebar.jsx'; // Importa o componente Sidebar
import '../styles/Header.css'; // Importa os estilos CSS para o Header

const Header = () => {
  // Obtém o estado de autenticação e as funções do contexto
  const { isAuthenticated, user, logout } = useAuth();
  
  // Estados para controlar a visibilidade da Sidebar e do Dropdown do perfil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ref para o contêiner do dropdown, usado para detectar cliques fora
  const dropdownRef = useRef(null);

  // Função para alternar a visibilidade da Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função para alternar a visibilidade do Dropdown do perfil
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Efeito para fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o clique não foi dentro do dropdown ou do seu botão, fecha o dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Adiciona o event listener ao documento quando o dropdown está aberto
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Remove o event listener quando o componente desmonta ou o dropdown fecha
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]); // O efeito roda novamente quando isDropdownOpen muda

  return (
    <>
      {/* O Sidebar é renderizado aqui e seu estado é controlado por isSidebarOpen */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* O cabeçalho principal da aplicação */}
      <header className="header-container">
        {/* Grupo da esquerda: Botão do menu e título */}
        <div className="header-left-group">
          <button className="menu-toggle-button" onClick={toggleSidebar}>
            ☰ {/* Ícone de hambúrguer */}
          </button>
          <h1 className='title'>Reddit</h1>
        </div>

        {/* Renderização Condicional: Mostra controles de usuário logado ou botões de login/cadastro */}
        {!isAuthenticated ? ( // Se o usuário NÃO ESTÁ AUTENTICADO
          <div>
            <Link to="/login" className="login-button">Entrar</Link>
            <Link to="/register" className="register-button">Cadastrar-se</Link>
          </div>
        ) : ( // Se o usuário ESTÁ AUTENTICADO
          <div className="logged">
            {/* NOVO BOTÃO: Criar Postagem */}
            <Link to="/create-post" className="create-post-header-button"> {/* <--- ESTE É O BOTÃO! */}
              + Criar Post
            </Link>
            
            <div className="profile-dropdown-container" ref={dropdownRef}>
              {user && user.profilePicUrl && (
                <Link to="#" onClick={toggleDropdown} className="profile-link-wrapper">
                  <img
                    src={user.profilePicUrl}
                    alt={user.username || 'Avatar'}
                    className="feed-profile-pic"
                  />
                </Link>
              )}

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <Link to={`/profile/${user.username}`} onClick={toggleDropdown} className="dropdown-item">Perfil</Link>
                    </li>
                    <li>
                      <button onClick={() => { logout(); toggleDropdown(); }} className="dropdown-item">Sair</button>
                    </li>
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