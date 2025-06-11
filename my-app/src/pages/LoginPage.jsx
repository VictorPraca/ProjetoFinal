// src/pages/LoginPage.jsx
import React from 'react'
import '/src/styles/LoginPage.css';
import '/src/styles/global.css'
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/feed'); 
  };

  return (
    // O contêiner principal da sua página de login'
    <div className="center-container"> {/* Aplica os estilos de centralização */}
      <div className="card-login"> {/* Estilos para o card do formulário */}
        <h1>Login</h1> {/* Título do formulário */}

        {/* Seus campos de E-mail / Nome de Usuário */}
        <label htmlFor="email-username">E-mail / Nome de Usuário:</label>
        <input type="text" id="email-username" name="email-username" placeholder="email/usuario" />
        <br/>
        {/* Seu campo de Senha */}
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" placeholder="senha" />
        <br/>
        {/* Seu botão Entrar */}
        <button onClick={handleLogin}>Entrar</button>

        {/* Opcional: Link para cadastro */}
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Não tem conta? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;