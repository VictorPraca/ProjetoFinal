import React, { useState } from 'react';
import Header from '../components/Header.jsx'; // Seu componente de cabeçalho
import { useAuth } from '../contexts/AuthContext.jsx'; // Para pegar o usuário logado
import api from '../services/api.js'; // Para simular o envio da postagem
import { useNavigate } from 'react-router-dom'; // Para redirecionar após a criação
import '../styles/CreatePost.css'; // O CSS para esta página

const CreatePost = () => {
  const { user } = useAuth(); // Obtém o usuário logado do contexto
  const navigate = useNavigate(); // Hook para navegação

  // Estados para gerenciar os campos do formulário de postagem
  const [contentType, setContentType] = useState('text'); // 'text', 'image', 'video'
  const [content, setContent] = useState(''); // Texto da postagem
  const [mediaUrl, setMediaUrl] = useState(''); // URL da imagem ou vídeo
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para o botão de envio
  const [error, setError] = useState(''); // Mensagem de erro
  const [success, setSuccess] = useState(''); // Mensagem de sucesso

  // Função para lidar com a submissão do formulário de postagem
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setIsSubmitting(true); // Ativa o estado de envio
    setError('');       // Limpa mensagens anteriores
    setSuccess('');

    // Validações básicas do formulário
    if (!user) {
      setError('Você precisa estar logado para criar uma postagem.');
      setIsSubmitting(false);
      return;
    }
    if (!content.trim() && (contentType === 'text' || !mediaUrl.trim())) {
      setError('A postagem não pode ser vazia.');
      setIsSubmitting(false);
      return;
    }
    if ((contentType === 'image' || contentType === 'video') && !mediaUrl.trim()) {
        setError(`Por favor, insira a URL da ${contentType}.`);
        setIsSubmitting(false);
        return;
    }

    try {
      // --- SIMULAÇÃO: Cria um objeto de postagem com dados mockados ---
      const newPost = {
        id: `post${Date.now()}`, // ID único (para o mock)
        user: { // Dados do usuário logado para a postagem
          id: user.id, // Adiciona o ID do usuário para futura distinção
          username: user.username,
          profilePicUrl: user.profilePicUrl,
        },
        createdAt: new Date().toISOString(), // Data atual da criação
        contentType: contentType, // Tipo de conteúdo selecionado
        content: content.trim(), // Conteúdo textual
        imageUrl: contentType === 'image' ? mediaUrl.trim() : undefined, // URL da imagem, se for imagem
        videoUrl: contentType === 'video' ? mediaUrl.trim() : undefined, // URL do vídeo, se for vídeo
        likes: 0, // Inicia com 0 likes
        dislikes: 0, // Inicia com 0 dislikes
        commentsCount: 0, // Inicia com 0 comentários
        communityId: undefined, // Esta postagem é para o feed geral
      };

      console.log('CreatePostPage: Enviando nova postagem (Simulado):', newPost);
      // Simula um atraso de rede para o envio da postagem
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      setSuccess('Postagem criada com sucesso! Redirecionando para o feed...');
      
      // Em um ambiente real, você enviaria newPost para o backend aqui:
      // const response = await api.post('/posts', newPost); // Exemplo de chamada API

      // Redireciona para o feed após um curto período
      setTimeout(() => {
        navigate('/'); 
      }, 1000);

    } catch (err) {
      console.error('CreatePostPage: Erro ao criar postagem (simulado):', err.response?.data || err.message);
      setError('Não foi possível criar a postagem. Tente novamente.');
    } finally {
      setIsSubmitting(false); // Desativa o estado de envio
    }
  };

  return (
    <div>
      <Header /> {/* Inclui o cabeçalho fixo na página */}
      <div className="create-post-page-container">
        <div className="create-post-form-wrapper">
            <h2>Criar Nova Postagem</h2>
            <form onSubmit={handleSubmit} className="create-post-form">
                {/* Seleção do tipo de conteúdo */}
                <div className="content-type-selector">
                <button
                    type="button"
                    className={contentType === 'text' ? 'active' : ''}
                    onClick={() => setContentType('text')}
                >
                    Texto
                </button>
                <button
                    type="button"
                    className={contentType === 'image' ? 'active' : ''}
                    onClick={() => setContentType('image')}
                >
                    Imagem
                </button>
                <button
                    type="button"
                    className={contentType === 'video' ? 'active' : ''}
                    onClick={() => setContentType('video')}
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

                {/* Campos para URL de mídia (se o tipo não for texto) */}
                {(contentType === 'image' || contentType === 'video') && (
                <input
                    type="url" // Usa tipo 'url' para validação básica de URL
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={
                    contentType === 'image' ? 'URL da imagem (ex: .jpg, .png)' :
                    'URL do vídeo (ex: .mp4, YouTube embed link)'
                    }
                    className="post-media-input"
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