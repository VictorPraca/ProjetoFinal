import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../contexts/AuthContext.jsx'; // Para pegar o usuário logado
import api from '../services/api.js'; // Para simular o envio da postagem
import { useNavigate } from 'react-router-dom'; // Para redirecionar após a criação
import '../styles/CreatePost.css'; // O CSS para esta página

const CreatePost = () => {
  // CORREÇÃO AQUI: Desestruturar 'isAuthenticated' também de useAuth()
  const { user, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  const [contentType, setContentType] = useState('text');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get('/api/groups');
        setCommunities(response.data);
      } catch (err) {
        console.error('Erro ao buscar comunidades para CreatePost:', err);
      }
    };
    // NOVO: Apenas busca comunidades se o usuário estiver autenticado
    if (isAuthenticated) { 
      fetchCommunities();
    }
  }, [isAuthenticated]); // Depende de isAuthenticated para re-buscar se o status mudar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!user || !isAuthenticated) { // Garantir que está logado
      setError('Você precisa estar logado para criar uma postagem.');
      setIsSubmitting(false);
      return;
    }
    if (!content.trim() && !(mediaFile && (contentType === 'image' || contentType === 'video'))) {
      setError('A postagem não pode ser vazia. Digite algo ou selecione uma mídia.');
      setIsSubmitting(false);
      return;
    }
    if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      setError(`Por favor, selecione um arquivo para a ${contentType}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('contentType', contentType);
      formData.append('content', content.trim());
      
      if (mediaFile) {
        formData.append('media', mediaFile); 
      }
      if (selectedCommunityId) {
        formData.append('communityId', selectedCommunityId); 
      }

      const response = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message || 'Postagem criada com sucesso! Redirecionando para o feed...');
      console.log('Postagem criada no backend:', response.data);

      setContent('');
      setMediaFile(null);
      setContentType('text');
      setSelectedCommunityId('');

      setTimeout(() => {
        navigate('/'); 
      }, 1000);

    } catch (err) {
      console.error('CreatePostPage: Erro ao criar postagem:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Não foi possível criar a postagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="create-post-page-container">
        <div className="create-post-form-wrapper">
            <h2>Criar Nova Postagem</h2>
            {/* NOVO: Renderiza o formulário apenas se autenticado */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmit} className="create-post-form">
                  {communities.length > 0 && (
                      <select
                          value={selectedCommunityId}
                          onChange={(e) => setSelectedCommunityId(e.target.value)}
                          className="community-select"
                      >
                          <option value="">Publicar no Feed Geral</option>
                          {communities.map(comm => (
                              <option key={comm.id} value={comm.id}>{comm.name}</option>
                          ))}
                      </select>
                  )}
                  {communities.length === 0 && (
                      <p className="no-communities-message">Nenhuma comunidade encontrada para postar. Crie uma primeiro!</p>
                  )}

                  <div className="content-type-selector">
                  <button
                      type="button"
                      className={contentType === 'text' ? 'active' : ''}
                      onClick={() => { setContentType('text'); setMediaFile(null); }}
                  >
                      Texto
                  </button>
                  <button
                      type="button"
                      className={contentType === 'image' ? 'active' : ''}
                      onClick={() => { setContentType('image'); setMediaFile(null); }}
                  >
                      Imagem
                  </button>
                  <button
                      type="button"
                      className={contentType === 'video' ? 'active' : ''}
                      onClick={() => { setContentType('video'); setMediaFile(null); }}
                  >
                      Vídeo
                  </button>
                  </div>

                  <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                      contentType === 'text' ? 'Digite sua postagem aqui...' :
                      contentType === 'image' ? 'Adicione uma legenda para sua imagem...' :
                      'Adicione uma descrição para seu vídeo...'
                  }
                  rows="4"
                  className="post-content-textarea"
                  ></textarea>

                  {(contentType === 'image' || contentType === 'video') && (
                  <input
                      type="file"
                      onChange={(e) => setMediaFile(e.target.files[0])}
                      className="post-media-input"
                      accept={contentType === 'image' ? 'image/*' : 'video/*'}
                  />
                  )}

                  {error && <p className="error-message">{error}</p>}
                  {success && <p className="success-message">{success}</p>}

                  <button type="submit" disabled={isSubmitting} className="submit-post-button">
                  {isSubmitting ? 'Publicando...' : 'Publicar'}
                  </button>
              </form>
            ) : (
              <p className="auth-prompt">Você precisa estar logado para criar uma postagem.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
