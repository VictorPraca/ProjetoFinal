// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import Header from '../components/Header.jsx'; // Importado como 'Header'
import Posts from '../components/Posts.jsx'; // <--- Importe o Post
import '../styles/ProfilePage.css';
import { MOCK_COMMUNITIES, MOCK_POSTS, COMMENT_USERS } from '../mockData.js';

// --- FIM DOS DADOS MOCKADOS DE POSTAGENS ---


const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true); // Renomeado para evitar conflito
  const [errorProfile, setErrorProfile] = useState(null);     // Renomeado para evitar conflito

  const [userPosts, setUserPosts] = useState([]);         // <--- Novo estado para as postagens do usuário
  const [loadingUserPosts, setLoadingUserPosts] = useState(true); // <--- Novo estado de loading para posts
  const [errorUserPosts, setErrorUserPosts] = useState(null);     // <--- Novo estado de erro para posts


  // Efeito para buscar os dados do perfil (foto, bio, etc.)
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      setProfileData(null);

      if (!username) {
        setErrorProfile('Nome de usuário não especificado na URL.');
        setLoadingProfile(false);
        return;
      }

      console.log(`ProfilePage: Buscando perfil para: ${username} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        let fetchedData = null;
        if (username === 'usuarioSimulado') {
          fetchedData = {
            username: 'usuarioSimulado',
            email: 'simulado@example.com',
            dob: '1990-01-01',
            profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            bio: 'Este é um usuário simulado para testes no frontend. Adoro tecnologia e jogos!',
          };
        } else if (username === 'outroUsuario') {
            fetchedData = {
                username: 'outroUsuario',
                email: 'outro@example.com',
                dob: '1995-05-10',
                profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png',
                bio: 'Olá! Sou um entusiasta de código e café.',
            };
        } else {
          setErrorProfile('Perfil simulado não encontrado para este nome de usuário.');
        }
        setProfileData(fetchedData);
        console.log('ProfilePage: Dados do perfil simulados carregados:', fetchedData);
      } catch (err) {
        console.error('ProfilePage: Erro ao buscar perfil (simulado):', err);
        setErrorProfile('Não foi possível carregar o perfil. Tente novamente.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [username]);


  // <--- NOVO EFEITO: Para buscar as postagens do usuário específico ---
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingUserPosts(true);
      setErrorUserPosts(null);
      setUserPosts([]); // Limpa posts anteriores

      if (!username) { // Só busca se o username estiver disponível
        setLoadingUserPosts(false);
        return;
      }

      console.log(`ProfilePage: Buscando postagens para: ${username} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula atraso

        // Filtra as postagens mockadas pelo username
        const postsByThisUser = MOCK_POSTS.filter(post => post.user.username === username);
        setUserPosts(postsByThisUser);
        console.log(`ProfilePage: Postagens de ${username} simuladas carregadas:`, postsByThisUser);

      } catch (err) {
        console.error('ProfilePage: Erro ao buscar postagens do usuário (simulado):', err);
        setErrorUserPosts('Não foi possível carregar as postagens.');
      } finally {
        setLoadingUserPosts(false);
      }
      // --- FIM DA SIMULAÇÃO DE POSTS ---

      // --- QUANDO O BACKEND ESTIVER PRONTO, VOCÊ FARÁ ALGO ASSIM: ---
      /*
      try {
        const response = await api.get(`/users/${username}/posts`); // Ex: /api/users/usuarioSimulado/posts
        setUserPosts(response.data);
      } catch (err) {
        console.error('ProfilePage: Erro ao buscar postagens reais do usuário:', err);
        setErrorUserPosts(err.response?.data?.message || 'Erro ao carregar postagens do usuário.');
      } finally {
        setLoadingUserPosts(false);
      }
      */
      // --- FIM DO CÓDIGO REAL DO BACKEND ---
    };

    fetchUserPosts();
  }, [username]); // Roda quando o username muda (ou seja, quando o perfil muda)


  // Renderização condicional para estados globais da página
  if (loadingProfile) {
    return (
      <div className="profile-container">
        <Header />
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="profile-container">
        <Header />
        <p style={{ color: 'red' }}>Erro ao carregar perfil: {errorProfile}</p>
      </div>
    );
  }

  // Se o profileData não existe (username não encontrado no mock)
  if (!profileData) {
    return (
      <div className="profile-container">
        <Header />
        <p>Perfil não encontrado.</p>
      </div>
    );
  }

  // Se o perfil foi carregado com sucesso, renderiza os detalhes e as postagens
  return (
    <div className="profile-container">
      <Header />

      {/* Seção do cabeçalho do perfil */}
      <div className="profile-header">
        <div className="profile-main-info">
          <img
            src={profileData.profilePicUrl}
            alt={profileData.username || 'Foto de Perfil'}
            className="profile-page-pic"
          />
          <h1>{profileData.username}</h1>
        </div>
        {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
      </div>

      {/* Seção de postagens do usuário */}
      <div className="profile-content">
        {loadingUserPosts && <p>Carregando postagens...</p>}
        {errorUserPosts && <p style={{ color: 'red' }}>Erro: {errorUserPosts}</p>}
        {!loadingUserPosts && !errorUserPosts && userPosts.length === 0 && (
          <p>{profileData.username} não possui posts.</p>
        )}

        {/* Mapeia e renderiza as postagens do usuário */}
        {!loadingUserPosts && !errorUserPosts && userPosts.length > 0 && (
          <div className="user-posts-list"> {/* <--- Nova classe para a lista de posts */}
            {userPosts.map((post) => (
              <Posts key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;