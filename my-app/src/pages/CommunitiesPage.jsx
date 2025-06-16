import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import api from '../services/api.js'; // Importa a instância da API
import { useAuth } from '../contexts/AuthContext.jsx'; // Para o usuário logado
import '../styles/CommunitiesPage.css'; // Estilos para a página de comunidades
import { Link } from 'react-router-dom'; // Importa Link

const CommunitiesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [errorCommunities, setErrorCommunities] = useState(null);

  const [newCommunityName, setNewCommunityName] = useState('');
  // CORREÇÃO AQUI: Garante que é um useState e não apenas uma string
  const [newCommunityDescription, setNewCommunityDescription] = useState(''); 
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  // Efeito para buscar todas as comunidades
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoadingCommunities(true);
      setErrorCommunities(null);
      console.log('CommunitiesPage: Buscando comunidades do backend...');
      try {
        const response = await api.get('/api/groups'); // Rota GET para todas as comunidades/grupos
        setCommunities(response.data);
        console.log('CommunitiesPage: Comunidades carregadas do backend.');
      } catch (err) {
        console.error('CommunitiesPage: Erro ao buscar comunidades do backend:', err.response?.data || err.message);
        setErrorCommunities(err.response?.data?.message || 'Não foi possível carregar as comunidades.');
      } finally {
        setLoadingCommunities(false);
      }
    };

    if (isAuthenticated) { // Busca apenas se o usuário estiver autenticado
      fetchCommunities();
    } else {
      setLoadingCommunities(false); // Se não autenticado, para o loading
      setErrorCommunities('Você precisa estar logado para ver as comunidades.');
    }
  }, [isAuthenticated]); // Roda quando o status de autenticação muda

  // Função para lidar com a criação de uma nova comunidade
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
      const response = await api.post('/api/groups', { // Rota POST para criar comunidade/grupo
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim(), // <--- ESTA LINHA VAI FUNCIONAR AGORA
      });
      setCreateSuccess(response.data.message || 'Comunidade criada com sucesso!');
      setCommunities(prev => [...prev, response.data.group]); // Adiciona a nova comunidade à lista
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

        {/* Seção para Criar Nova Comunidade */}
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
                value={newCommunityDescription} // <--- ESTA LINHA IRÁ FUNCIONAR
                onChange={(e) => setNewCommunityDescription(e.target.value)} // <--- ESTA LINHA IRÁ FUNCIONAR
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

        {/* Seção para Explorar Comunidades */}
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
