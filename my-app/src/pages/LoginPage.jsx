import React, { useState } from 'react'; 
import '../styles/LoginPage.css'; 
import { useAuth } from '../contexts/AuthContext.jsx'; 
import { Route, Routes } from 'react-router-dom';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const { login } = useAuth(); 


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error("Erro ao tentar fazer login:", err);

      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    
    <div className="center-container">
      <h1 className="login-reddit-title">Tidder</h1>
      <div className="card-login">
        <h2>Login</h2>


        <form onSubmit={handleSubmit}>
          <label htmlFor="email-username">E-mail:</label>
          <input
            type="text"
            id="email-username"
            name="email-username"
            placeholder="E-mail"
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