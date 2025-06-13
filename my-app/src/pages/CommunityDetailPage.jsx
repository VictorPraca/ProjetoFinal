import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/CommunityDetailPage.css'; 
import { MOCK_COMMUNITIES, MOCK_POSTS, COMMENT_USERS } from '../mockData.js';

// --- FIM DOS DADOS MOCKADOS ---

const CommunityDetailPage = () => {
  const { communityName } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [errorCommunity, setErrorCommunity] = useState(null);

  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingCommunityPosts, setLoadingCommunityPosts] = useState(true);
  const [errorCommunityPosts, setErrorCommunityPosts] = useState(null);

  // Efeito para buscar detalhes da comunidade
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      setLoadingCommunity(true);
      setErrorCommunity(null);
      setCommunityData(null);

      if (!communityName) {
        setErrorCommunity('Nome da comunidade não especificado na URL.');
        setLoadingCommunity(false);
        return;
      }

      console.log(`CommunityPage: Buscando detalhes para: ${communityName} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundCommunity = MOCK_COMMUNITIES.find(comm => comm.slug === communityName);
        setCommunityData(foundCommunity);
        if (!foundCommunity) {
          setErrorCommunity('Comunidade não encontrada.');
        }
        console.log('CommunityPage: Detalhes da comunidade simulados carregados:', foundCommunity);
      } catch (err) {
        console.error('CommunityPage: Erro ao buscar detalhes da comunidade (simulado):', err);
        setErrorCommunity('Não foi possível carregar os detalhes da comunidade.');
      } finally {
        setLoadingCommunity(false);
      }
    };
    fetchCommunityDetails();
  }, [communityName]);

  // Efeito para buscar postagens da comunidade
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      setLoadingCommunityPosts(true);
      setErrorCommunityPosts(null);
      setCommunityPosts([]);

      if (!communityName || !communityData?.id) {
        setLoadingCommunityPosts(false);
        return;
      }

      console.log(`CommunityPage: Buscando postagens para: ${communityName} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const postsInCommunity = MOCK_POSTS.filter(post => post.communityId === communityData.id);
        setCommunityPosts(postsInCommunity);
        console.log(`CommunityPage: Postagens de ${communityName} simuladas carregadas:`, postsInCommunity);
      } catch (err) {
        console.error('CommunityPage: Erro ao buscar postagens da comunidade (simulado):', err);
        setErrorCommunityPosts('Não foi possível carregar as postagens da comunidade.');
      } finally {
        setLoadingCommunityPosts(false);
      }
    };
    if (communityData) { // Só busca posts se os dados da comunidade já foram carregados
        fetchCommunityPosts();
    }
  }, [communityName, communityData]);

  // Funções para simular entrar/sair da comunidade
  const handleJoinLeaveCommunity = () => {
    if (communityData) {
      setCommunityData(prev => ({
        ...prev,
        isMember: !prev.isMember,
        membersCount: prev.isMember ? prev.membersCount - 1 : prev.membersCount + 1,
      }));
      console.log(`CommunityPage: Usuário ${communityData.isMember ? 'saiu' : 'entrou'} da comunidade ${communityName}`);
    }
  };

  // Renderização condicional para estados globais da página (loading/error da comunidade)
  if (loadingCommunity) {
    return (
      <div className="community-page-layout"> {/* Usaremos este para o layout */}
        <Header />
        <p>Carregando detalhes da comunidade...</p>
      </div>
    );
  }

  if (errorCommunity) {
    return (
      <div className="community-page-layout">
        <Header />
        <p style={{ color: 'red' }}>Erro ao carregar comunidade: {errorCommunity}</p>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="community-page-layout">
        <Header />
        <p>Comunidade não encontrada.</p>
      </div>
    );
  }

  // Se tudo carregou, exibe o layout de duas colunas
  return (
    <div>
      <Header />
      <div className="community-page-layout"> {/* Contêiner principal para o layout de duas colunas */}
        
        {/* Coluna Esquerda: Informações da Comunidade */}
        <aside className="community-info-sidebar"> {/* Usando <aside> para semântica */}
          <div className="community-info-card">
            <h1>{communityData.name}</h1>
            <p className="community-description">{communityData.description}</p>
            <div className="community-meta-details">
              <span>{communityData.membersCount} membros</span>
              <span>Criada em: {new Date(communityData.createdAt).toLocaleDateString()}</span>
              {communityData.isAdmin && <span className="admin-tag">Você é Admin</span>}
            </div>
            <button onClick={handleJoinLeaveCommunity} className={`join-leave-button ${communityData.isMember ? 'leave' : 'join'}`}>
              {communityData.isMember ? 'Sair da Comunidade' : 'Entrar na Comunidade'}
            </button>
          </div>

          {/* Seção para criar nova postagem na comunidade (pode ir aqui ou no centro) */}
          <div className="create-post-community-section">
            <h3>Criar Nova Postagem</h3>
            <p>Em breve, você poderá criar postagens aqui!</p>
            {/* Futuramente, você pode integrar um formulário de criação de postagem aqui.
                Ex: <CreatePostForm communityId={communityData.id} onPostCreated={handlePostCreated} /> */}
          </div>
        </aside>

        {/* Coluna Central: Postagens da Comunidade */}
        <main className="community-posts-main"> {/* Usando <main> para semântica */}
          {loadingCommunityPosts && <p>Carregando postagens...</p>}
          {errorCommunityPosts && <p className="error-message">{errorCommunityPosts}</p>}
          {!loadingCommunityPosts && !errorCommunityPosts && communityPosts.length === 0 && (
            <p>Nenhuma postagem nesta comunidade.</p>
          )}

          <div className="community-posts-list">
            {!loadingCommunityPosts && !errorCommunityPosts && communityPosts.length > 0 && (
              communityPosts.map((post) => (
                <Posts key={post.id} post={post} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunityDetailPage;