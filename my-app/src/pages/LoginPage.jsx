// src/pages/LoginPage.jsx
import React, { useState } from 'react'; // Importe useState para gerenciar os campos do formulário
import '../styles/LoginPage.css'; // Se você tem um CSS específico para esta página
import { useAuth } from '../contexts/AuthContext.jsx'; 
import { Route, Routes } from 'react-router-dom';// Importa o hook para acessar o contexto de autenticação

const LoginPage = () => {
  // Estados para armazenar os valores dos campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para exibir mensagens de erro

  const { login } = useAuth(); // Obtém a função de login do contexto de autenticação

  // Função que será chamada ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página
    setError(''); // Limpa erros anteriores

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Chama a função de login do seu contexto, passando e-mail e senha
      await login(email, password);
      // Se o login for bem-sucedido, o AuthContext.jsx já vai redirecionar para a página principal (Feed)
    } catch (err) {
      // Se houver um erro no login (ex: credenciais inválidas)
      console.error("Erro ao tentar fazer login:", err);
      // Pode exibir uma mensagem de erro mais específica do backend aqui
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    
    <div className="center-container">
      <h1 className="login-reddit-title">Reddit</h1>
      <div className="card-login">
        <h2>Login</h2>

        {/* Adicione o formulário e o onSubmit */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email-username">E-mail / Nome de Usuário:</label>
          <input
            type="text"
            id="email-username"
            name="email-username"
            placeholder="E-mail/User"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

          <button type="submit">Entrar</button>
        </form>

        <p>
          Não tem conta? <a href="/register" className='register-link'>Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;