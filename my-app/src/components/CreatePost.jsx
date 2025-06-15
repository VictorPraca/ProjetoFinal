// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js'; // Para enviar dados ao backend real
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePost.css';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contentType, setContentType] = useState('text'); // 'text', 'image', 'video'
  const [content, setContent] = useState(''); // Texto da postagem
  const [mediaFile, setMediaFile] = useState(null); // <-- MUDANÇA: Para armazenar o OBJETO File
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!user) {
      setError('Você precisa estar logado para criar uma postagem.');
      setIsSubmitting(false);
      return;
    }
    // Validação para conteúdo vazio: ou tem texto, ou tem mídia
    if (!content.trim() && !(mediaFile && (contentType === 'image' || contentType === 'video'))) {
      setError('A postagem não pode ser vazia. Digite algo ou selecione uma mídia.');
      setIsSubmitting(false);
      return;
    }
    // Validação para tipo de mídia sem arquivo
    if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      setError(`Por favor, selecione um arquivo para a ${contentType}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      // MUDANÇA: Criar um FormData para enviar arquivos para o backend
      const formData = new FormData();
      formData.append('contentType', contentType);
      formData.append('content', content.trim());
      
      if (mediaFile) {
        // MUDANÇA: Anexar o arquivo de mídia ao FormData
        // 'media' é o nome do campo que o Multer (backend) espera em postController.js
        formData.append('media', mediaFile); 
      }

      // MUDANÇA: Chamar a API REAL do backend para criar a postagem
      console.log('CreatePostPage: Enviando nova postagem para o backend...');
      const response = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // <-- Essencial para enviar arquivos!
        },
      });

      setSuccess(response.data.message || 'Postagem criada com sucesso! Redirecionando para o feed...');
      console.log('Postagem criada no backend:', response.data);

      // Limpar formulário após sucesso
      setContent('');
      setMediaFile(null);
      setContentType('text');

      // Redireciona para o feed após um curto período
      setTimeout(() => {
        navigate('/'); 
      }, 1000);

    } catch (err) {
      console.error('CreatePostPage: Erro ao criar postagem:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Não foi possível criar a postagem. Tente novamente.');
    } finally {
      setIsSubmitting(false); // Desativa o estado de envio
    }
  };

  return (
    <div>
      <Header />
      <div className="create-post-page-container">
        <div className="create-post-form-wrapper">
            <h2>Criar Nova Postagem</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                {/* Seleção do tipo de conteúdo */}
                <div className="content-type-selector">
                <button
                    type="button"
                    className={contentType === 'text' ? 'active' : ''}
                    onClick={() => { setContentType('text'); setMediaFile(null); }} // Limpa arquivo ao mudar tipo
                >
                    Texto
                </button>
                <button
                    type="button"
                    className={contentType === 'image' ? 'active' : ''}
                    onClick={() => { setContentType('image'); setMediaFile(null); }} // Limpa arquivo ao mudar tipo
                >
                    Imagem
                </button>
                <button
                    type="button"
                    className={contentType === 'video' ? 'active' : ''}
                    onClick={() => { setContentType('video'); setMediaFile(null); }} // Limpa arquivo ao mudar tipo
                >
                    Vídeo
                </button>
                </div>

                {/* Campo de texto principal da postagem */}
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

                {/* Campo para seleção de arquivo de mídia (se o tipo não for texto) */}
                {(contentType === 'image' || contentType === 'video') && (
                <input
                    type="file" // <-- MUDANÇA: Tipo 'file' para upload
                    onChange={(e) => setMediaFile(e.target.files[0])} // Armazena o objeto File
                    className="post-media-input"
                    // Opcional: Adicione 'accept' para filtrar tipos de arquivo
                    accept={contentType === 'image' ? 'image/*' : 'video/*'}
                />
                )}

                {/* Mensagens de erro e sucesso */}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {/* Botão de envio da postagem */}
                <button type="submit" disabled={isSubmitting} className="submit-post-button">
                {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;