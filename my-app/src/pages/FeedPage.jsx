// src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react'; // <--- Importe useState e useEffect
import Header from '../components/Header.jsx';
import PostCard from '../components/Posts.jsx'; // <--- Importe o PostCard
import '../styles/FeedPage.css'; // Mantenha o CSS para o conteúdo do Feed

// --- DADOS MOCKADOS DE POSTAGENS (SIMULAÇÃO DO BACKEND) ---
// src/pages/FeedPage.jsx (e ProfilePage.jsx, se você copiou o mock de posts)

const MOCK_POSTS = [
  {
    id: 'post1',
    user: { username: 'outroUsuario',
      profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png', },
    createdAt: new Date('2025-06-11T10:00:00Z').toISOString(),
    contentType: 'text',
    content: 'Olá a todos! Que dia lindo para testar a nova rede social!',
    likes: 15,
    dislikes: 2,
    commentsCount: 5,
    communityId: 'comm1', // <--- Adicione este ID da comunidade para 'Programação'
  },
  {
    id: 'post2',
    user: {username: 'usuarioSimulado',
      profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', },
    createdAt: new Date('2025-06-10T15:30:00Z').toISOString(),
    contentType: 'image',
    content: 'Meu novo setup de trabalho, o que acharam?',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-d41f71a48c66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    likes: 45,
    dislikes: 1,
    commentsCount: 12,
    communityId: 'comm2', // <--- Adicione este ID da comunidade para 'ReactJs Brasil'
  },
  {
    id: 'post3',
    user: { username: 'outroUsuario',
      profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png', },
    createdAt: new Date('2025-06-09T08:15:00Z').toISOString(),
    contentType: 'video',
    content: 'Olhem só essa dica de produtividade que aprendi!',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 22,
    dislikes: 0,
    commentsCount: 3,
    communityId: 'comm1', // <--- Adicione este ID da comunidade
  },
  {
    id: 'post4',
    user: { username: 'usuarioSimulado',
      profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', },
    createdAt: new Date('2025-06-08T18:00:00Z').toISOString(),
    contentType: 'text',
    content: 'Hoje o dia foi produtivo! #devlife',
    likes: 30,
    dislikes: 0,
    commentsCount: 7,
    communityId: 'comm2', // <--- Adicione este ID da comunidade
  },
];
// --- FIM DOS DADOS MOCKADOS ---


const FeedPage = () => {
  // Remove isSidebarOpen e toggleSidebar (já no AppHeader)
  const [posts, setPosts] = useState([]); // Estado para as postagens
  const [loadingPosts, setLoadingPosts] = useState(true); // Estado de carregamento das postagens
  const [errorPosts, setErrorPosts] = useState(null); // Estado de erro das postagens

  // Efeito para buscar as postagens (simuladamente)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);

      console.log('FeedPage: Buscando postagens (Simulado)...');
      try {
        // Simula um atraso de rede para ver o estado de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPosts(MOCK_POSTS); // Define as postagens mockadas no estado
        console.log('FeedPage: Postagens simuladas carregadas.');

      } catch (err) {
        console.error('FeedPage: Erro ao buscar postagens (simulado):', err);
        setErrorPosts('Não foi possível carregar as postagens. Tente novamente.');
      } finally {
        setLoadingPosts(false);
      }
      // --- FIM DA SIMULAÇÃO ---

      // --- QUANDO O BACKEND ESTIVER PRONTO, VOCÊ FARÁ ALGO ASSIM: ---
      /*
      try {
        const response = await api.get('/posts'); // Supondo que você terá uma API /posts
        setPosts(response.data);
      } catch (err) {
        console.error('FeedPage: Erro ao buscar postagens reais:', err);
        setErrorPosts(err.response?.data?.message || 'Erro ao carregar postagens.');
      } finally {
        setLoadingPosts(false);
      }
      */
      // --- FIM DO CÓDIGO REAL DO BACKEND ---
    };

    fetchPosts();
  }, []); // Array vazio para rodar apenas uma vez ao montar o componente


  return (
    <div>
      <Header /> {/* O cabeçalho com o botão da sidebar */}

      <div className="feed-content-main">
        {loadingPosts && <p>Carregando postagens...</p>}
        {errorPosts && <p style={{ color: 'red' }}>Erro: {errorPosts}</p>}
        {!loadingPosts && !errorPosts && posts.length === 0 && (
          <p>Nenhuma postagem encontrada.</p>
        )}
        
        {/* Renderiza a lista de postagens se não estiver carregando e não houver erro */}
        {!loadingPosts && !errorPosts && posts.length > 0 && (
          <div className="posts-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} /> // Mapeia cada postagem para um PostCard
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;