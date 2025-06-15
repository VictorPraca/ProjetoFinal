import React, { useState } from 'react';
import '../styles/LoginPage.css';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  // Estados para cada campo do formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // MUDANÇA 1: Nome do estado para Data de Nascimento deve ser 'dateOfBirth'
  const [dateOfBirth, setDateOfBirth] = useState('');
  // MUDANÇA 2: Estado para o arquivo de foto de perfil (objeto File), não URL string
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

    // Validações básicas no frontend
    // MUDANÇA 3: Usar 'dateOfBirth' na validação
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
      // MUDANÇA 4: Usar FormData para enviar todos os dados, especialmente se houver um arquivo
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('dateOfBirth', dateOfBirth); // Nome do campo corresponde ao backend

      // MUDANÇA 5: Anexar o arquivo de foto de perfil se ele existir
      // O nome do campo 'profilePicture' deve corresponder ao que o Multer espera no backend
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      // MUDANÇA 6: Enviar FormData e definir o Content-Type como 'multipart/form-data'
      const response = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Indispensável para enviar arquivos
        },
      });

      setSuccess(response.data.message || 'Cadastro realizado com sucesso! Você pode fazer login agora.');
      console.log('Usuário cadastrado:', response.data);

      // Limpar o formulário após o sucesso
      setUsername('');
      setEmail('');
      setDateOfBirth('');
      setProfilePicture(null); // Limpar o estado do arquivo também
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro no cadastro:', err.response?.data || err.message);
      // Ajuste para exibir mensagens de erro mais específicas do backend
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

          {/* MUDANÇA 7: htmlFor e name correspondem ao estado 'dateOfBirth' */}
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

          {/* MUDANÇA 8: Input para upload de arquivo de foto de perfil */}
          <label htmlFor="profilePicture">Foto de Perfil (Opcional):</label>
          <input
            type="file" // <-- CRUCIAL: tipo 'file' para upload
            id="profilePicture"
            name="profilePicture" // <-- CRUCIAL: nome do campo esperado pelo Multer no backend
            accept="image/*" // Restringe a seleção para arquivos de imagem
            onChange={(e) => setProfilePicture(e.target.files[0])} // Armazena o objeto File
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