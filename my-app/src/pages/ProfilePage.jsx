import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import '../styles/ProfilePage.css';

const BASE_BACKEND_URL = 'http://localhost:5000';
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [errorUserPosts, setErrorUserPosts] = useState(null);

  const [userTags, setUserTags] = useState([]);
  const [editingTags, setEditingTags] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagError, setTagError] = useState(null);



  const fetchProfileDetails = useCallback(async () => {
    setLoadingProfile(true);
    setErrorProfile(null);
    setProfileData(null);
    setUserTags([]); 
    setTagError(null); 

    if (!username) {
      setErrorProfile('Nome de usuário não especificado na URL.');
      setLoadingProfile(false);
      return;
    }

    console.log(`ProfilePage: Buscando perfil para: ${username} do backend...`);
    try {
      const profileResponse = await api.get(`/api/users/username/${username}`);
      const fetchedData = profileResponse.data;

      if (fetchedData.profilePicture) {
          fetchedData.profilePicture = `${BASE_BACKEND_URL}${fetchedData.profilePicture}`;
      } else {
          fetchedData.profilePicture = DEFAULT_USER_PROFILE_PIC;
      }

      setProfileData(fetchedData);
      console.log('ProfilePage: Dados do perfil carregados:', fetchedData.username);

      if (isAuthenticated) { 
        try {
          const tagsResponse = await api.get(`/api/tags/user/${username}`);
          setUserTags(tagsResponse.data.map(tag => tag.name)); 
          console.log('ProfilePage: Tags do usuário carregadas:', tagsResponse.data);
        } catch (tagErr) {
          console.error('ProfilePage: Erro ao buscar tags:', tagErr.response?.data || tagErr.message);
          setTagError(tagErr.response?.data?.message || 'Não foi possível carregar as tags.');
          setUserTags([]);
        }
      } else {
        setUserTags([]); 
      }

    } catch (err) {
      console.error('ProfilePage: Erro ao buscar perfil principal:', err.response?.data || err.message);
      setErrorProfile(err.response?.data?.message || 'Não foi possível carregar o perfil.');
    } finally {
      setLoadingProfile(false);
    }
  }, [username, isAuthenticated]);

  const fetchUserPosts = useCallback(async () => {
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
      setUserPosts(response.data);
      console.log(`ProfilePage: Postagens de ${username} carregadas.`);
    } catch (err) {
      console.error('ProfilePage: Erro ao buscar postagens do usuário:', err.response?.data || err.message);
      setErrorUserPosts(err.response?.data?.message || 'Erro ao carregar postagens do usuário.');
    } finally {
      setLoadingUserPosts(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfileDetails();
    fetchUserPosts();
  }, [fetchProfileDetails, fetchUserPosts]);


  const handleAddTag = (e) => {
    e.preventDefault();
    setTagError(null);
    if (!newTagInput.trim()) {
        setTagError('A tag não pode ser vazia.');
        return;
    }
    const lowerCaseTag = newTagInput.trim().toLowerCase();
    if (userTags.includes(lowerCaseTag)) {
        setTagError('Esta tag já foi adicionada.');
        return;
    }
    if (userTags.length >= 5) {
        setTagError('Máximo de 5 tags permitidas.');
        return;
    }
    setUserTags(prev => [...prev, lowerCaseTag]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setUserTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSaveTags = async () => {
    setTagError(null);
    if (!isAuthenticated || !currentUser) {
      setTagError('Você precisa estar logado para salvar as tags.');
      return;
    }
    try {
        await api.post('/api/tags', { tags: userTags }); 
        setEditingTags(false); 
        fetchProfileDetails(); 
        alert('Tags salvas com sucesso!');
    } catch (err) {
        console.error('Erro ao salvar tags:', err.response?.data || err.message);
        setTagError(err.response?.data?.message || 'Erro ao salvar tags. Tente novamente.');
    }
  };


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

  const isOwnProfile = isAuthenticated && currentUser?.username === username;

  return (
    <div className="profile-container">
      <Header />

      <div className="profile-header">
        <div className="profile-main-info">
          <img
            src={profileData.profilePicture}
            alt={profileData.username || 'Foto de Perfil'}
            className="profile-page-pic"
          />
          <h1>{profileData.username}</h1>
          {profileData.bio && <p className="profile-bio-text">{profileData.bio}</p>}
          {!profileData.bio && <p className="profile-no-bio-message">Nenhuma biografia definida ainda.</p>}
        </div>
      </div>

      <div className="profile-tags-section">
        <h2>Interesses</h2>
        {tagError && <p className="error-message">{tagError}</p>}
        
        {editingTags ? (
            <div className="tags-edit-mode">
                <div className="current-tags-list">
                    {userTags.length === 0 && <p className="no-tags-message">Nenhuma tag adicionada ainda.</p>}
                    {userTags.map(tag => (
                        <span key={tag} className="tag-bubble editable-tag">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="remove-tag-button">x</button>
                        </span>
                    ))}
                </div>
                <form onSubmit={handleAddTag} className="add-tag-form">
                    <input 
                        type="text" 
                        value={newTagInput} 
                        onChange={(e) => setNewTagInput(e.target.value)} 
                        placeholder="Adicionar nova tag (máx. 5)" 
                        maxLength="20"
                    />
                    <button type="submit" className="add-tag-button">Adicionar</button>
                </form>
                <div className="tag-actions-buttons">
                    <button onClick={handleSaveTags} className="save-tags-button">Salvar Tags</button>
                    <button onClick={() => { setEditingTags(false); setTagError(null); fetchProfileDetails(); }} className="cancel-tags-button">Cancelar</button>
                </div>
            </div>
        ) : ( 
            <div className="tags-view-mode">
                {userTags.length === 0 ? (
                    <p className="no-tags-message">Nenhuma tag adicionada ainda.</p>
                ) : (
                    <div className="current-tags-list">
                        {userTags.map(tag => (
                            <span key={tag} className="tag-bubble">{tag}</span>
                        ))}
                    </div>
                )}
                {isOwnProfile && (
                    <button onClick={() => setEditingTags(true)} className="edit-tags-button">Editar Tags</button>
                )}
            </div>
        )}
      </div>

      <div className="profile-content">
        <h2>Postagens</h2>
        {loadingUserPosts && <p>Carregando postagens...</p>}
        {errorUserPosts && <p style={{ color: 'red' }}>Erro: {errorUserPosts}</p>}
        {!loadingUserPosts && !errorUserPosts && userPosts.length === 0 && (
          <p>{profileData.username} não possui posts.</p>
        )}

        <div className="user-posts-list">
          {!loadingUserPosts && !errorUserPosts && userPosts.length > 0 && (
            userPosts.map((post) => (
              <Posts key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
