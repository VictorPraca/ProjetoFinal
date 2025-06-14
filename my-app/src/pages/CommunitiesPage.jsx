import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx'; 
import api from '../services/api.js'; // Para simular chamadas ao backend
import { Link } from 'react-router-dom'; // Para links para comunidades individuais (futuro)
import '../styles/CommunitiesPage.css'; 
import { MOCK_COMMUNITIES } from '../mockData.js'; // Vamos criar este CSS

// --- FIM DOS DADOS MOCKADOS DE COMUNIDADES ---

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [errorCommunities, setErrorCommunities] = useState(null);

  // Estados para o formulário de criação de comunidade
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  // Efeito para buscar a lista de comunidades (simuladamente)
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoadingCommunities(true);
      setErrorCommunities(null);
      console.log('CommunitiesPage: Buscando comunidades (Simulado)...');
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula atraso
        setCommunities(MOCK_COMMUNITIES); // Define as comunidades mockadas
        console.log('CommunitiesPage: Comunidades simuladas carregadas.');
      } catch (err) {
        console.error('CommunitiesPage: Erro ao buscar comunidades (simulado):', err);
        setErrorCommunities('Não foi possível carregar as comunidades.');
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []); // Rodar apenas uma vez

  // Função para lidar com a criação de uma nova comunidade
  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setCreatingCommunity(true);
    setCreateError(null);
    setCreateSuccess(null);

    if (!newCommunityName.trim() || !newCommunityDescription.trim()) {
      setCreateError('Nome e descrição da comunidade são obrigatórios.');
      setCreatingCommunity(false);
      return;
    }

    try {
      // Simulação de chamada à API para criar comunidade
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar um ID simples para o mock
      const newId = `comm${communities.length + 1}`; 
      const newCommunity = {
        id: newId,
        name: newCommunityName,
        description: newCommunityDescription,
        createdAt: new Date().toISOString(),
        membersCount: 1, // O criador é o primeiro membro
        isAdmin: true, // O criador é admin
      };

      // Adiciona a nova comunidade à lista (no frontend)
      setCommunities(prev => [...prev, newCommunity]);
      setCreateSuccess(`Comunidade "${newCommunityName}" criada com sucesso!`);
      setNewCommunityName('');
      setNewCommunityDescription('');
      console.log('Comunidade simulada criada:', newCommunity);

    } catch (err) {
      console.error('CommunitiesPage: Erro ao criar comunidade (simulado):', err);
      setCreateError('Erro ao criar comunidade. Tente novamente.');
    } finally {
      setCreatingCommunity(false);
    }
  };


  return (
    <div>
      <Header /> {/* Seu cabeçalho fixo */}
      <div className="communities-page-content"> {/* Contêiner principal da página */}
        <h1>Comunidades</h1>

        {/* Formulário para Criar Nova Comunidade */}
        <div className="create-community-section">
          <h2>Criar Nova Comunidade</h2>
          <form onSubmit={handleCreateCommunity} className="create-community-form">
            <label htmlFor="communityName">Nome da Comunidade:</label>
            <input
              type="text"
              id="communityName"
              value={newCommunityName}
              onChange={(e) => setNewCommunityName(e.target.value)}
              placeholder="Ex: Desenvolvedores Frontend"
            />

            <label htmlFor="communityDescription">Descrição:</label>
            <textarea
              id="communityDescription"
              value={newCommunityDescription}
              onChange={(e) => setNewCommunityDescription(e.target.value)}
              placeholder="Descreva sua comunidade"
              rows="3"
            ></textarea>

            {createError && <p className="error-message">{createError}</p>}
            {createSuccess && <p className="success-message">{createSuccess}</p>}

            <button type="submit" disabled={creatingCommunity}>
              {creatingCommunity ? 'Criando...' : 'Criar Comunidade'}
            </button>
          </form>
        </div>

        {/* Lista de Comunidades Existentes */}
        <div className="communities-list-section">
          <h2>Explorar Comunidades</h2>
          {loadingCommunities && <p>Carregando comunidades...</p>}
          {errorCommunities && <p className="error-message">{errorCommunities}</p>}
          {!loadingCommunities && !errorCommunities && communities.length === 0 && (
            <p>Nenhuma comunidade encontrada.</p>
          )}

          <div className="communities-grid">
            {!loadingCommunities && !errorCommunities && communities.length > 0 && (
               communities.map((community) => (
                <div key={community.id} className="community-card">
                  {/* O Link agora usa o 'slug' da comunidade */}
                  <Link to={`/community/${community.slug}`} className="community-name-link"> {/* <--- MUDANÇA AQUI */}
                    <h3>{community.name}</h3>
                  </Link>
                  <p>{community.description}</p>
                  <div className="community-meta">
                    <span>{community.membersCount} membros</span>
                    <span>Criada em: {new Date(community.createdAt).toLocaleDateString()}</span>
                  </div>
                  {community.isAdmin && <span className="admin-tag">Você é Admin</span>}
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