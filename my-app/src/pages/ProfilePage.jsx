import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx'; // Importa o componente Post (ou PostCard)
import '../styles/ProfilePage.css';

const BASE_BACKEND_URL = 'http://localhost:5000'; // Mesma base URL do backend
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; // Foto padrão

const ProfilePage = () => {
  const { username } = useParams(); // Obtém o nome de usuário da URL
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [errorUserPosts, setErrorUserPosts] = useState(null);

  // Efeito para buscar os dados do perfil (foto, bio, etc.) por username
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

      console.log(`ProfilePage: Buscando perfil para: ${username} do backend...`);
      try {
        // CHAMA A API DO BACKEND USANDO o USERNAME
        const response = await api.get(`/api/users/username/${username}`);
        
        // Montar a URL da foto de perfil para o ProfileData
        const fetchedProfileData = {
            ...response.data,
            profilePicture: response.data.profilePicture
                ? `${BASE_BACKEND_URL}${response.data.profilePicture}`
                : DEFAULT_USER_PROFILE_PIC
        };

        setProfileData(fetchedProfileData);
        console.log('ProfilePage: Dados do perfil carregados do backend:', fetchedProfileData.username);
      } catch (err) {
        console.error('ProfilePage: Erro ao buscar perfil do backend:', err.response?.data || err.message);
        setErrorProfile(err.response?.data?.message || 'Não foi possível carregar o perfil. Tente novamente.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [username]); // Roda quando o username na URL muda

  // Efeito para buscar as postagens do usuário específico por username
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingUserPosts(true);
      setErrorUserPosts(null);
      setUserPosts([]); 

      if (!username) {
        setLoadingUserPosts(false);
        return;
      }

      console.log(`ProfilePage: Buscando postagens para: ${username} do backend...`);
      try {
        // CHAMA A API DO BACKEND PARA AS POSTAGENS DO USUÁRIO
        const response = await api.get(`/api/users/username/${username}/posts`);
        
        // Os dados já vêm prontos, a montagem da URL da mídia será feita no componente 'Posts.jsx'
        setUserPosts(response.data);
        console.log(`ProfilePage: Postagens de ${username} carregadas do backend.`);
      } catch (err) {
        console.error('ProfilePage: Erro ao buscar postagens do usuário do backend:', err.response?.data || err.message);
        setErrorUserPosts(err.response?.data?.message || 'Erro ao carregar postagens do usuário.');
      } finally {
        setLoadingUserPosts(false);
      }
    };

    fetchUserPosts();
  }, [username]); // Roda quando o username na URL muda

  // Renderização condicional para estados globais da página (loading, error, not found)
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
      <Header /> {/* O Header já está configurado para ser sticky via CSS */}

      {/* Seção do cabeçalho do perfil */}
      <div className="profile-header">
        <div className="profile-main-info">
          <img
            src={profileData.profilePicture}
            alt={profileData.username || 'Foto de Perfil'}
            className="profile-page-pic"
          />
          <h1>{profileData.username}</h1>
          {/* NOVO: Bio diretamente abaixo do nome, se existir */}
          {profileData.bio && <p className="profile-bio-text">{profileData.bio}</p>}
          {!profileData.bio && <p className="profile-no-bio-message">Nenhuma biografia definida ainda.</p>}
        </div>
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
          <div className="user-posts-list">
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
