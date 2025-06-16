import React, { useState, useEffect, useCallback } from 'react'; // Importar useCallback
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx'; // Para exibir as postagens da comunidade
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/CommunityDetailPage.css'; // Estilos para a página de comunidades

const BASE_BACKEND_URL = 'http://localhost:5000'; // Base URL para imagens de perfil/mídia
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const CommunityDetailPage = () => {
  const { groupId } = useParams(); // Obtém o ID do grupo da URL como string
  const { isAuthenticated, user } = useAuth();
  
  const [communityDetails, setCommunityDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);

  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);

  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // NOVO: Função fetchCommunityDetails movida para fora do useEffect
  // Usar useCallback para memorizar a função e evitar re-criação desnecessária
  const fetchCommunityDetails = useCallback(async () => {
    setLoadingDetails(true);
    setErrorDetails(null);
    setCommunityDetails(null);
    setIsMember(false);
    setIsAdmin(false);

    const communityIdNum = parseInt(groupId, 10);
    if (isNaN(communityIdNum) || communityIdNum <= 0) {
      setErrorDetails('ID da comunidade inválido na URL.');
      setLoadingDetails(false);
      return;
    }

    console.log(`CommunityDetailPage: Buscando detalhes para ID: ${communityIdNum} do backend...`);
    try {
      const response = await api.get(`/api/groups/${communityIdNum}`);
      const fetchedData = response.data;

      if (fetchedData.Creator?.profilePicture) {
          fetchedData.Creator.profilePicture = `${BASE_BACKEND_URL}${fetchedData.Creator.profilePicture}`;
      } else {
          fetchedData.Creator.profilePicture = DEFAULT_USER_PROFILE_PIC;
      }

      setCommunityDetails(fetchedData);
      console.log('CommunityDetailPage: Detalhes da comunidade carregados:', fetchedData.name);

      if (isAuthenticated && user && fetchedData.Users) {
          const memberInfo = fetchedData.Users.find(m => m.id === user.id);
          if (memberInfo) {
              setIsMember(true);
              if (memberInfo.GroupMember?.role === 'administrator') {
                  setIsAdmin(true);
              }
          }
      }

    } catch (err) {
      console.error('CommunityDetailPage: Erro ao buscar detalhes da comunidade:', err.response?.data || err.message);
      setErrorDetails(err.response?.data?.message || 'Não foi possível carregar os detalhes da comunidade.');
    } finally {
      setLoadingDetails(false);
    }
  }, [groupId, isAuthenticated, user]); // Dependências do useCallback

  // NOVO: Função fetchCommunityPosts movida para fora do useEffect
  const fetchCommunityPosts = useCallback(async () => {
    setLoadingPosts(true);
    setErrorPosts(null);
    setCommunityPosts([]);

    const communityIdNum = parseInt(groupId, 10);
    if (isNaN(communityIdNum) || communityIdNum <= 0 || !isAuthenticated) {
      setLoadingPosts(false);
      return;
    }

    console.log(`CommunityDetailPage: Buscando postagens para comunidade ID: ${communityIdNum} do backend...`);
    try {
      const response = await api.get(`/api/groups/${communityIdNum}/posts`);
      setCommunityPosts(response.data);
      console.log(`CommunityDetailPage: Postagens da comunidade ${communityIdNum} carregadas.`);
    } catch (err) {
      console.error('CommunityDetailPage: Erro ao buscar postagens da comunidade:', err.response?.data || err.message);
      setErrorPosts(err.response?.data?.message || 'Não foi possível carregar as postagens da comunidade.');
    } finally {
      setLoadingPosts(false);
    }
  }, [groupId, isAuthenticated]); // Dependências do useCallback

  // Efeito para chamar fetchCommunityDetails na montagem ou mudança de groupId/auth
  useEffect(() => {
    if (isAuthenticated) { // Só busca detalhes se o usuário estiver autenticado
        fetchCommunityDetails();
    } else {
        setLoadingDetails(false);
        setErrorDetails('Você precisa estar logado para ver os detalhes da comunidade.');
    }
  }, [fetchCommunityDetails, isAuthenticated]); // Depende da função e da autenticação

  // Efeito para chamar fetchCommunityPosts na montagem ou mudança de groupId/auth
  useEffect(() => {
    if (isAuthenticated) { // Busca posts apenas se autenticado
        fetchCommunityPosts();
    } else {
        setLoadingPosts(false);
        setErrorPosts('Faça login para ver as postagens da comunidade.');
    }
  }, [fetchCommunityPosts, isAuthenticated]); // Depende da função e autenticação

  const handleJoinLeaveCommunity = async () => {
    if (!isAuthenticated || !user) {
        alert('Você precisa estar logado para entrar/sair de comunidades.');
        return;
    }
    setLoadingDetails(true); // Re-carrega os detalhes para atualizar o estado de membro
    try {
        const communityIdNum = parseInt(groupId, 10);
        if (isNaN(communityIdNum) || communityIdNum <= 0) {
            alert('ID da comunidade inválido.');
            setLoadingDetails(false);
            return;
        }

        if (isMember) {
            await api.post('/api/groups/leave', { groupId: communityIdNum });
            alert('Você saiu da comunidade.');
        } else {
            await api.post('/api/groups/join', { groupId: communityIdNum });
            alert('Você entrou na comunidade!');
        }
        // Após a ação, re-buscamos os detalhes para atualizar os membros/status
        // Chamada explícita à função, que agora está fora do useEffect
        fetchCommunityDetails(); 
    } catch (error) {
        console.error('Erro ao entrar/sair da comunidade:', error.response?.data || error.message);
        alert('Erro ao processar sua solicitação. Tente novamente.');
    } finally {
        setLoadingDetails(false);
    }
  };


  if (loadingDetails) {
    return (
      <div className="community-detail-container">
        <Header />
        <p>Carregando detalhes da comunidade...</p>
      </div>
    );
  }

  if (errorDetails) {
    return (
      <div className="community-detail-container">
        <Header />
        <p style={{ color: 'red' }}>Erro: {errorDetails}</p>
      </div>
    );
  }

  if (!communityDetails) {
    return (
      <div className="community-detail-container">
        <Header />
        <p>Comunidade não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="community-detail-container">
      <Header />
      <div className="community-detail-content">
        {/* Banner ou cabeçalho da comunidade */}
        <div className="community-banner">
            <h1>c/{communityDetails.name}</h1>
            <p className="community-banner-description">{communityDetails.description || 'Nenhuma descrição.'}</p>
            <p className="community-banner-meta">
                Criada por: <Link to={`/profile/${communityDetails.Creator?.username}`}>{communityDetails.Creator?.username}</Link>
                <span> • Membros: {communityDetails.Users?.length || 0}</span>
                <span> • Criada em: {new Date(communityDetails.createdAt).toLocaleDateString()}</span>
            </p>
            
            {isAuthenticated && (
                <button 
                    onClick={handleJoinLeaveCommunity} 
                    className={`community-join-button ${isMember ? 'leave' : 'join'}`}
                    disabled={loadingDetails} // Desabilita enquanto carrega
                >
                    {loadingDetails ? 'Processando...' : (isMember ? 'Sair da Comunidade' : 'Entrar na Comunidade')}
                </button>
            )}
            {!isAuthenticated && <p className="community-auth-prompt">Faça login para interagir com esta comunidade.</p>}
            
            {isAdmin && <span className="community-admin-tag">Você é Administrador</span>}
        </div>

        {/* Seção de postagens da comunidade */}
        <div className="community-posts-section">
            <h2>Postagens da Comunidade</h2>
            {loadingPosts && <p>Carregando postagens...</p>}
            {errorPosts && <p className="error-message">{errorPosts}</p>}
            {!loadingPosts && !errorPosts && communityPosts.length === 0 && (
            <p>Nenhuma postagem nesta comunidade ainda. Seja o primeiro a postar!</p>
            )}

            <div className="community-posts-list">
            {!loadingPosts && !errorPosts && communityPosts.length > 0 && (
                communityPosts.map((post) => (
                <Posts key={post.id} post={post} />
                ))
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;
