import React, { useState } from 'react';
// Importe seu CSS de página de login ou um novo CSS para registro
import '../styles/LoginPage.css'; // Podemos reutilizar as classes de estilo como 'center-container' e 'card-login'
// import './RegisterPage.css'; // Ou criar um arquivo CSS específico se preferir

import api from '../services/api.js'; // Para enviar dados ao backend
import { useNavigate } from 'react-router-dom'; // Para redirecionar após o cadastro

const RegisterPage = () => {
  // Estados para cada campo do formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(''); // Data de nascimento
  const [profilePicUrl, setProfilePicUrl] = useState(''); // URL da foto de perfil
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Para mensagens de erro
  const [success, setSuccess] = useState(''); // Para mensagens de sucesso

  const navigate = useNavigate(); // Hook para redirecionar

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setError('');       // Limpa erros anteriores
    setSuccess('');     // Limpa sucessos anteriores

    // Validações básicas no frontend
    if (!username || !email || !dob || !password || !confirmPassword) {
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

    // Validação de formato de e-mail (simples)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      // Objeto com os dados do usuário a serem enviados para o backend
      const userData = {
        username,
        email,
        dob, // A data de nascimento pode precisar de formatação específica para o backend (ex: 'YYYY-MM-DD')
        profilePicUrl: profilePicUrl || 'https://via.placeholder.com/150', // Fornece uma URL padrão se não for preenchida
        password,
      };

      // Chama a API de registro no backend
      const response = await api.post('/auth/register', userData);

      setSuccess('Cadastro realizado com sucesso! Você pode fazer login agora.');
      console.log('Usuário cadastrado:', response.data);

      // Opcional: Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redireciona após 2 segundos

    } catch (err) {
      console.error('Erro no cadastro:', err.response?.data || err.message);
      // Mensagem de erro do backend (ex: "Nome de usuário já existe", "E-mail já cadastrado")
      setError(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="center-container"> {/* Reutiliza classe de centralização */}
      <div className="card-login"> {/* Reutiliza classe de estilo de card */}
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
          />

          <label htmlFor="dob">Data de Nascimento:</label>
          <input
            type="date" // Tipo 'date' para seleção de data
            id="dob"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <br/>

          <label htmlFor="profilePicUrl">URL da Foto de Perfil (Opcional):</label>
          <input
            type="text"
            id="profilePicUrl"
            name="profilePicUrl"
            placeholder="Link para sua foto de perfil"
            value={profilePicUrl}
            onChange={(e) => setProfilePicUrl(e.target.value)}
          />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}

          <button type="submit">Cadastrar</button>
        </form>

        <p>
          Já tem conta? <a href="/login" className='login-button'>Fazer Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;