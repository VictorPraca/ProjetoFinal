import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Para obter o usuário logado
import Comment from './Comment.jsx'; // Importa o componente Comment
import CreateComment from './CreateComment.jsx'; // Importa o formulário de criação de comentário
import '../styles/Posts.css'; // CSS do PostCard

const Posts= ({ post }) => {
  const { user } = useAuth(); // Obtém o usuário logado do contexto
  
  // Estados para likes/dislikes da postagem
  const [currentLikes, setCurrentLikes] = useState(post.likes);
  const [currentDislikes, setCurrentDislikes] = useState(post.dislikes);
  const [userInteraction, setUserInteraction] = useState(null); 
  // userInteraction: null (não avaliou), 'liked' (curtiu), 'disliked' (descurtiu)
  // Em um app real, o estado inicial de userInteraction viria do backend,
  // verificando se o usuário logado já avaliou esta postagem.

  // Estado para controlar a visibilidade da seção de comentários
  const [showComments, setShowComments] = useState(false);
  // Estado para a lista de comentários da postagem (inicializa com os da prop 'post')
  const [postComments, setPostComments] = useState(post.comments || []); 


  // Função para lidar com o Like na postagem
  const handleLike = async () => {
    if (!user) { // Se não estiver logado, não pode interagir
      alert('Faça login para curtir ou descurtir uma postagem.');
      return;
    }
    // Lógica para alternar o like/dislike
    if (userInteraction === 'liked') { // Já curtiu, então está removendo o like
      setCurrentLikes(prev => prev - 1);
      setUserInteraction(null);
    } else { // Não curtiu ou descurtiu, então está curtindo
      setCurrentLikes(prev => prev + 1);
      if (userInteraction === 'disliked') { // Se estava descurtido, remove o dislike
        setCurrentDislikes(prev => prev - 1);
      }
      setUserInteraction('liked');
    }

    // --- SIMULAÇÃO DE CHAMADA À API ---
    try {
      console.log(`PostCard: Simulação de ${userInteraction === 'liked' ? 'remover like' : 'dar like'} no post ${post.id}`);
      // Em um app real: await api.post(`/posts/${post.id}/like`, { userId: user.id });
    } catch (error) {
      console.error('Erro ao simular like:', error);
      // Lógica para reverter o estado em caso de erro na API
    }
  };

  // Função para lidar com o Dislike na postagem
  const handleDislike = async () => {
    if (!user) {
      alert('Faça login para curtir ou descurtir uma postagem.');
      return;
    }
    // Lógica para alternar o dislike/like
    if (userInteraction === 'disliked') { // Já descurtiu, então está removendo o dislike
      setCurrentDislikes(prev => prev - 1);
      setUserInteraction(null);
    } else { // Não descurtiu ou curtiu, então está descurtindo
      setCurrentDislikes(prev => prev + 1);
      if (userInteraction === 'liked') { // Se estava curtido, remove o like
        setCurrentLikes(prev => prev - 1);
      }
      setUserInteraction('disliked');
    }

    // --- SIMULAÇÃO DE CHAMADA À API ---
    try {
      console.log(`PostCard: Simulação de ${userInteraction === 'disliked' ? 'remover dislike' : 'dar dislike'} no post ${post.id}`);
      // Em um app real: await api.post(`/posts/${post.id}/dislike`, { userId: user.id });
    } catch (error) {
      console.error('Erro ao simular dislike:', error);
      // Lógica para reverter o estado em caso de erro na API
    }
  };

  // Função para adicionar um novo comentário ou resposta (passada para CreateCommentForm e Comment)
  // Esta função é CRÍTICA para a recursividade e gerenciamento de comentários/respostas
  const handleCommentCreated = (newComment, parentCommentId = null) => {
    if (parentCommentId) { // Se o novo comentário tem um pai (é uma resposta)
      setPostComments(prevComments =>
        prevComments.map(comment =>
          // Encontra o comentário pai e adiciona a nova resposta ao array 'replies' dele
          comment.id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        )
      );
    } else { // Se for um comentário de nível superior (sem pai)
      setPostComments(prevComments => [...prevComments, newComment]); // Adiciona ao array principal de comentários
    }
  };


  const { id, user: postUser, createdAt, contentType, content, imageUrl, videoUrl } = post; // commentsCount do original

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${postUser.username}`} className="post-user-link">
          <img src={postUser.profilePicUrl} alt={postUser.username} className="post-user-pic" />
          <span className="post-username">{postUser.username}</span>
        </Link>
        <span className="post-date">{new Date(createdAt).toLocaleString()}</span>
      </div>

      <div className="post-content">
        {contentType === 'text' && <p>{content}</p>}
        {contentType === 'image' && (
          <>
            {content && <p>{content}</p>}
            <img src={imageUrl} alt="Postagem" className="post-image" />
          </>
        )}
        {contentType === 'video' && (
          <>
            {content && <p>{content}</p>}
            <video controls src={videoUrl} className="post-video"></video>
          </>
        )}
      </div>

      <div className="post-actions">
        <button
          className={`action-button like-button ${userInteraction === 'liked' ? 'active' : ''}`}
          onClick={handleLike}
        >
          👍 {currentLikes}
        </button>
        <button
          className={`action-button dislike-button ${userInteraction === 'disliked' ? 'active' : ''}`}
          onClick={handleDislike}
        >
          👎 {currentDislikes}
        </button>
        
        {/* Botão de Comentários para alternar a visibilidade da seção */}
        <button className="action-button comment-button" onClick={() => setShowComments(!showComments)}>
          💬 {postComments.length} Comentários {/* Mostra a contagem de comentários */}
        </button>
      </div>

      {/* Seção de Comentários (visível apenas se showComments for true) */}
      {showComments && (
        <div className="post-comments-section">
          {/* Formulário para adicionar um novo comentário de nível superior */}
          <CreateComment
            postId={id} // Passa o ID da postagem
            onCommentCreated={handleCommentCreated} // Passa a função de callback
          />

          {/* Lista de comentários */}
          <div className="comments-list">
            {postComments.length === 0 ? (
              <p className="no-comments-message">Seja o primeiro a comentar!</p>
            ) : (
              // Mapeia e renderiza cada comentário, passando o callback para respostas
              postComments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={id} // Passa o ID da postagem (necessário para o CreateCommentForm recursivo)
                  onReplyCreated={handleCommentCreated} // <--- IMPORTANTE: Passa o callback para respostas aninhadas
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;