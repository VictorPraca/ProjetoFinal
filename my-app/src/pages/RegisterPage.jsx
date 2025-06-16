import React, { useState } from 'react';
import '../styles/LoginPage.css';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !dateOfBirth || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('A senha e a confirmação de senha não coincidem.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('dateOfBirth', dateOfBirth);

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      setSuccess(response.data.message || 'Cadastro realizado com sucesso! Você pode fazer login agora.');
      console.log('Usuário cadastrado:', response.data);

      setUsername('');
      setEmail('');
      setDateOfBirth('');
      setProfilePicture(null);
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro no cadastro:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao cadastrar. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="center-container">
      <div className="card-login">
        <h1>Cadastro</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Escolha um nome de usuário único"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br/>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="dateOfBirth">Data de Nascimento:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <br/>

          <label htmlFor="profilePicture">Foto de Perfil (Opcional):</label>
          <input
            type="file" 
            id="profilePicture"
            name="profilePicture" 
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])} 
          />
          <br/>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}

          <button type="submit">Cadastrar</button>
        </form>

        <p>
          Já tem conta? <a href="/login">Fazer Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;