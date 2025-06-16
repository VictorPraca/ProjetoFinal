// my-app/src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Posts from '../components/Posts.jsx'; // Importa o componente 'Posts' como default
import '../styles/FeedPage.css';
import api from '../services/api.js'; // Importe a instância da API

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);
      console.log('FeedPage: Buscando postagens do backend...');

      try {
        const response = await api.get('/api/posts');
        setPosts(response.data); // Os dados já virão com 'User' e 'userHasInteracted'
        console.log('FeedPage: Postagens carregadas do backend.');
      } catch (err) {
        console.error('FeedPage: Erro ao buscar postagens do backend:', err.response?.data || err.message);
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
              <Posts key={post.id} post={post} /> // Renderiza o componente 'Posts'
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
