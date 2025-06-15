// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx'; // Use 'Posts' conforme o nome do seu componente
import '../styles/ProfilePage.css';

const BASE_BACKEND_URL = 'http://localhost:5000'; // Mantenha aqui para montar a foto de perfil do próprio usuário

const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [errorUserPosts, setErrorUserPosts] = useState(null);

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

      console.log(`ProfilePage: Buscando perfil para: ${username} do backend...`);
      try {
        const response = await api.get(`/api/users/username/${username}`);
        
        // Montar a URL da foto de perfil para o ProfileData neste ponto, se for exibida diretamente aqui
        const fetchedProfileData = {
            ...response.data,
            profilePicture: response.data.profilePicture
                ? `${BASE_BACKEND_URL}${response.data.profilePicture}`
                : DEFAULT_USER_PROFILE_PIC // Você pode definir uma URL padrão aqui também
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
  }, [username]);

  // NOVO EFEITO: Para buscar as postagens do usuário específico do backend
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
        const response = await api.get(`/api/users/username/${username}/posts`);
        
        // Os posts já vêm prontos, a montagem da URL da mídia será feita no componente 'Posts.jsx'
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
  }, [username]);

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

  return (
    <div className="profile-container">
      <Header />

      <div className="profile-header">
        <div className="profile-main-info">
          <img
            src={profileData.profilePicture} // Já está com a URL completa ou padrão
            alt={profileData.username || 'Foto de Perfil'}
            className="profile-page-pic"
          />
          <h1>{profileData.username}</h1>
        </div>
        {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
      </div>

      <div className="profile-content">
        {loadingUserPosts && <p>Carregando postagens...</p>}
        {errorUserPosts && <p style={{ color: 'red' }}>Erro: {errorUserPosts}</p>}
        {!loadingUserPosts && !errorUserPosts && userPosts.length === 0 && (
          <p>{profileData.username} não possui posts.</p>
        )}

        <div className="user-posts-list">
          {!loadingUserPosts && !errorUserPosts && userPosts.length > 0 && (
            userPosts.map((post) => (
              // Passe o objeto 'post' diretamente para o componente 'Posts'
              <Posts key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;