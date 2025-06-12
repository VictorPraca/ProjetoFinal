// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setProfileData(null);

      if (!username) {
        setError('Nome de usuário não especificado na URL.');
        setLoading(false);
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
          setError('Perfil simulado não encontrado para este nome de usuário.');
        }

        setProfileData(fetchedData);
        console.log('ProfilePage: Dados do perfil simulados carregados:', fetchedData);

      } catch (err) {
        console.error('ProfilePage: Erro ao buscar perfil (simulado):', err);
        setError('Não foi possível carregar o perfil. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-container">
        <p>Carregando foto de perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p style={{ color: 'red' }}>Erro: {error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <p>Foto de perfil não disponível ou usuário não encontrado.</p>
      </div>
    );
  }

  if (profileData && profileData.profilePicUrl) {
    return (
      <div className="profile-container">
        {/* Este é o div do cabeçalho do perfil */}
        <div className="profile-header">
          {/* NOVO: Este div agrupa a foto e o nome para ficarem lado a lado */}
          <div className="profile-main-info"> {/* <--- NOVA CLASSE AQUI */}
            <img
              src={profileData.profilePicUrl}
              alt={profileData.username || 'Foto de Perfil'}
              className="profile-page-pic"
            />
            <h1>{profileData.username}</h1>
          </div>

          {/* A bio agora está DENTRO do profile-header, mas será abaixo devido ao flex-direction: column */}
          {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
          {/* Se você quiser email e dob aqui também: */}
          {/* <p>Email: {profileData.email}</p> */}
          {/* <p>Nascimento: {profileData.dob}</p> */}

        </div>

        {/* Este é o div para os detalhes (mantido aqui para mostrar o email/dob, se quiser) */}

      </div>
    );
  }

  return (
    <div className="profile-container">
      <p>Foto de perfil não disponível para este usuário.</p>
    </div>
  );
};

export default ProfilePage;