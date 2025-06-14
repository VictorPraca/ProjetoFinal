// src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import PostCard from '../components/Posts.jsx';
import '../styles/FeedPage.css';
import { MOCK_POSTS, COMMENT_USERS } from '../mockData';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);

  // Função para adicionar uma nova postagem ao estado
  const handlePostCreated = (newPost) => {
    // Adiciona a nova postagem no topo da lista
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);
      console.log('FeedPage: Buscando postagens (Simulado)...');
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(MOCK_POSTS);
        console.log('FeedPage: Postagens simuladas carregadas.');
      } catch (err) {
        console.error('FeedPage: Erro ao buscar postagens (simulado):', err);
        setErrorPosts('Não foi possível carregar as postagens. Tente novamente.');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);


  return (
    <div>
      <Header />

      <div className="feed-content-main">
        {loadingPosts && <p>Carregando postagens...</p>}
        {errorPosts && <p style={{ color: 'red' }}>Erro: {errorPosts}</p>}
        {!loadingPosts && !errorPosts && posts.length === 0 && (
          <p>Nenhuma postagem encontrada.</p>
        )}
        
        <div className="posts-list">
          {!loadingPosts && !errorPosts && posts.length > 0 && (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;