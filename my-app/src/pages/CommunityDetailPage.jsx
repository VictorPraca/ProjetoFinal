import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostCard from '../components/Posts.jsx';
import api from '../services/api.js'; // Para simular chamadas
import { useAuth } from '../contexts/AuthContext.jsx'; // Para saber se o user é membro/admin
import '../styles/CommunityDetailPage.css'; // Vamos criar este CSS

// --- DADOS MOCKADOS DE COMUNIDADES (Copie de CommunitiesPage.jsx) ---
const MOCK_COMMUNITIES = [
  {
    id: 'comm1',
    name: 'Programação',
    slug: 'programacao', // <--- ADICIONE ESTA PROPRIEDADE
    description: 'Comunidade para discutir sobre programação, linguagens, frameworks e desenvolvimento em geral.',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    membersCount: 1500,
    isMember: false,
    isAdmin: false,
  },
  {
    id: 'comm2',
    name: 'ReactJs Brasil',
    slug: 'reactjs-brasil', // <--- ADICIONE ESTA PROPRIEDADE
    description: 'Tudo sobre React.js no Brasil. Dúvidas, dicas, projetos e eventos.',
    createdAt: new Date('2023-08-20T14:30:00Z').toISOString(),
    membersCount: 800,
    isMember: true,
    isAdmin: true,
  },
  {
    id: 'comm3',
    name: 'Jogos Online',
    slug: 'jogos-online', // <--- ADICIONE ESTA PROPRIEDADE
    description: 'Para apaixonados por jogos online, notícias, reviews e encontrar times.',
    createdAt: new Date('2024-03-01T18:00:00Z').toISOString(),
    membersCount: 2300,
    isMember: false,
    isAdmin: false,
  },
  // ... adicione slugs para quaisquer outras comunidades que você tenha
];

// --- DADOS MOCKADOS DE POSTAGENS (Copie os posts ATUALIZADOS com communityId) ---
const MOCK_POSTS = [
  {
    id: 'post1', user: { username: 'usuarioSimulado', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', }, createdAt: new Date('2025-06-11T10:00:00Z').toISOString(), contentType: 'text', content: 'Olá a todos! Que dia lindo para testar a nova rede social!', likes: 15, dislikes: 2, commentsCount: 5, communityId: 'comm1',
  },
  {
    id: 'post2', user: { username: 'outroUsuario', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png', }, createdAt: new Date('2025-06-10T15:30:00Z').toISOString(), contentType: 'image', content: 'Meu novo setup de trabalho, o que acharam?', imageUrl: 'https://images.unsplash.com/photo-1542831371-d41f71a48c66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', likes: 45, dislikes: 1, commentsCount: 12, communityId: 'comm2',
  },
  {
    id: 'post3', user: { username: 'usuarioSimulado', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', }, createdAt: new Date('2025-06-09T08:15:00Z').toISOString(), contentType: 'video', content: 'Olhem só essa dica de produtividade que aprendi!', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 22, dislikes: 0, commentsCount: 3, communityId: 'comm1',
  },
  { id: 'post4', user: { username: 'outroUsuario', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png', }, createdAt: new Date('2025-06-08T18:00:00Z').toISOString(), contentType: 'text', content: 'Hoje o dia foi produtivo! #devlife', likes: 30, dislikes: 0, commentsCount: 7, communityId: 'comm2',
  },
];
// --- FIM DOS DADOS MOCKADOS ---

const CommunityDetailPage = () => {
  const { communityName } = useParams(); // Obtém o nome da comunidade da URL
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
        // Encontra a comunidade pelo slug na URL
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
  }, [communityName]); // Roda quando o nome da comunidade na URL muda

  // Efeito para buscar postagens da comunidade
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      setLoadingCommunityPosts(true);
      setErrorCommunityPosts(null);
      setCommunityPosts([]);

      if (!communityName || !communityData?.id) { // Precisa do ID da comunidade
        setLoadingCommunityPosts(false);
        return;
      }

      console.log(`CommunityPage: Buscando postagens para: ${communityName} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Filtra postagens pelo communityId (que vem do communityData)
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
    // Garante que communityData esteja disponível antes de buscar posts
    if (communityData) {
        fetchCommunityPosts();
    }
  }, [communityName, communityData]); // Roda quando communityName ou communityData mudam

  // Funções para simular entrar/sair da comunidade
  const handleJoinLeaveCommunity = () => {
    // Lógica para simular a adesão/saída
    if (communityData) {
      setCommunityData(prev => ({
        ...prev,
        isMember: !prev.isMember,
        membersCount: prev.isMember ? prev.membersCount - 1 : prev.membersCount + 1,
      }));
      console.log(`CommunityPage: Usuário ${communityData.isMember ? 'saiu' : 'entrou'} da comunidade ${communityName}`);
      // Em um ambiente real, você faria uma chamada API para /community/:id/join ou /leave
    }
  };

  // Renderização condicional para estados de carregamento/erro da comunidade
  if (loadingCommunity) {
    return (
      <div className="community-detail-container">
        <Header />
        <p>Carregando detalhes da comunidade...</p>
      </div>
    );
  }

  if (errorCommunity) {
    return (
      <div className="community-detail-container">
        <Header />
        <p style={{ color: 'red' }}>Erro: {errorCommunity}</p>
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="community-detail-container">
        <Header />
        <p>Comunidade não encontrada.</p>
      </div>
    );
  }

  // Se tudo carregou, exibe os detalhes da comunidade e suas postagens
  return (
    <div className="community-detail-container">
      <Header />

      <div className="community-detail-header">
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

      <div className="community-posts-section">
        <h2>Postagens na Comunidade</h2>
        {loadingCommunityPosts && <p>Carregando postagens da comunidade...</p>}
        {errorCommunityPosts && <p className="error-message">{errorCommunityPosts}</p>}
        {!loadingCommunityPosts && !errorCommunityPosts && communityPosts.length === 0 && (
          <p>Nenhuma postagem nesta comunidade.</p>
        )}

        {/* Lista de postagens da comunidade */}
        {!loadingCommunityPosts && !errorCommunityPosts && communityPosts.length > 0 && (
          <div className="community-posts-list">
            {communityPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Seção para criar nova postagem na comunidade (futuramente) */}
      <div className="create-post-community-section">
        <h3>Criar Nova Postagem</h3>
        <p>Em breve, você poderá criar postagens aqui!</p>
      </div>
    </div>
  );
};

export default CommunityDetailPage;