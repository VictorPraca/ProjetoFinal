import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import api from '../services/api.js'; 
import { useAuth } from '../contexts/AuthContext.jsx'; 
import '../styles/CommunitiesPage.css'; 
import { Link } from 'react-router-dom'; 

const CommunitiesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [errorCommunities, setErrorCommunities] = useState(null);

  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState(''); 
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoadingCommunities(true);
      setErrorCommunities(null);
      console.log('CommunitiesPage: Buscando comunidades do backend...');
      try {
        const response = await api.get('/api/groups'); 
        setCommunities(response.data);
        console.log('CommunitiesPage: Comunidades carregadas do backend.');
      } catch (err) {
        console.error('CommunitiesPage: Erro ao buscar comunidades do backend:', err.response?.data || err.message);
        setErrorCommunities(err.response?.data?.message || 'Não foi possível carregar as comunidades.');
      } finally {
        setLoadingCommunities(false);
      }
    };

    if (isAuthenticated) { 
      fetchCommunities();
    } else {
      setLoadingCommunities(false); 
      setErrorCommunities('Você precisa estar logado para ver as comunidades.');
    }
  }, [isAuthenticated]); 

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setCreatingCommunity(true);
    setCreateError(null);
    setCreateSuccess(null);

    if (!isAuthenticated || !user) {
      setCreateError('Você precisa estar logado para criar uma comunidade.');
      setCreatingCommunity(false);
      return;
    }
    if (!newCommunityName.trim()) {
      setCreateError('O nome da comunidade não pode ser vazio.');
      setCreatingCommunity(false);
      return;
    }

    try {
      const response = await api.post('/api/groups', { 
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim(),
      });
      setCreateSuccess(response.data.message || 'Comunidade criada com sucesso!');
      setCommunities(prev => [...prev, response.data.group]); 
      setNewCommunityName('');
      setNewCommunityDescription('');
    } catch (err) {
      console.error('Erro ao criar comunidade:', err.response?.data || err.message);
      setCreateError(err.response?.data?.message || 'Erro ao criar comunidade. Tente novamente.');
    } finally {
      setCreatingCommunity(false);
    }
  };

  return (
    <div className="communities-page-container">
      <Header />
      <div className="communities-content">
        <h1>Comunidades</h1>

        <div className="create-community-section">
          <h2>Criar Nova Comunidade</h2>
          {isAuthenticated ? (
            <form onSubmit={handleCreateCommunity} className="create-community-form">
              <input
                type="text"
                placeholder="Nome da Comunidade (Ex: Desenvolvedores Frontend)"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição (Ex: Discuta sobre desenvolvimento web, frameworks e ferramentas...)"
                value={newCommunityDescription} 
                onChange={(e) => setNewCommunityDescription(e.target.value)} 
                rows="3"
              ></textarea>
              {createError && <p className="error-message">{createError}</p>}
              {createSuccess && <p className="success-message">{createSuccess}</p>}
              <button type="submit" disabled={creatingCommunity}>
                {creatingCommunity ? 'Criando...' : 'Criar Comunidade'}
              </button>
            </form>
          ) : (
            <p className="auth-prompt">Faça login para criar novas comunidades.</p>
          )}
        </div>

        <div className="explore-communities-section">
          <h2>Explorar Comunidades</h2>
          {loadingCommunities && <p>Carregando comunidades...</p>}
          {errorCommunities && <p className="error-message">{errorCommunities}</p>}
          {!loadingCommunities && !errorCommunities && communities.length === 0 && (
            <p>Nenhuma comunidade encontrada. Crie a primeira!</p>
          )}
          
          <div className="communities-list">
            {!loadingCommunities && !errorCommunities && communities.length > 0 && (
              communities.map(community => (
                <div key={community.id} className="community-card">
                  <h3>{community.name}</h3>
                  <p>{community.description || 'Nenhuma descrição.'}</p>
                  <p className="community-creator">Criador: {community.Creator?.username || 'Desconhecido'}</p>
                  <Link to={`/community/${community.id}`} className="view-community-button">Ver Comunidade</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
