import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Para verificar o user logado
import CreateComment from './CreateComment.jsx'; // Importa o formulário de criação/resposta
import '../styles/Comment.css'; // O CSS para este componente

// Componente para exibir um único comentário
const Comment = ({ comment, postId, onReplyCreated, level = 0 }) => {
  const { user: currentUser } = useAuth(); // Usuário logado
  const [showReplyForm, setShowReplyForm] = useState(false); // Estado para mostrar/esconder formulário de resposta
  
  // Estados para as avaliações do comentário
  const [currentCommentLikes, setCurrentCommentLikes] = useState(comment.likes || 0);
  const [currentCommentDislikes, setCurrentCommentDislikes] = useState(comment.dislikes || 0);
  const [userCommentInteraction, setUserCommentInteraction] = useState(null); 
  // Em um app real, userCommentInteraction viria do backend (se o user já avaliou este comentário)

  // Funções para curtir/descurtir comentário (similares às de PostCard)
  const handleCommentLike = () => {
    if (!currentUser) { alert('Faça login para avaliar comentários.'); return; }
    if (userCommentInteraction === 'liked') { setCurrentCommentLikes(prev => prev - 1); setUserCommentInteraction(null); }
    else { setCurrentCommentLikes(prev => prev + 1); if (userCommentInteraction === 'disliked') setCurrentCommentDislikes(prev => prev - 1); setUserCommentInteraction('liked'); }
    // console.log(`Simulação de like no comentário ${comment.id}`); // Chamada API real: /comments/:id/like
  };

  const handleCommentDislike = () => {
    if (!currentUser) { alert('Faça login para avaliar comentários.'); return; }
    if (userCommentInteraction === 'disliked') { setCurrentCommentDislikes(prev => prev - 1); setUserCommentInteraction(null); }
    else { setCurrentCommentDislikes(prev => prev + 1); if (userCommentInteraction === 'liked') setCurrentCommentLikes(prev => prev - 1); setUserCommentInteraction('disliked'); }
    // console.log(`Simulação de dislike no comentário ${comment.id}`); // Chamada API real: /comments/:id/dislike
  };

  // Previne recursão infinita se o nível de aninhamento for muito profundo
  // Limita o nível de aninhamento de respostas para evitar sobrecarga visual
  if (level > 3) return null; // Limita a 3 níveis de recuo

  return (
    <div className={`comment-bubble level-${level}`}>
      <div className="comment-header">
        <Link to={`/profile/${comment.user.username}`} className="comment-user-link">
          <img src={comment.user.profilePicUrl} alt={comment.user.username} className="comment-user-pic" />
          <span className="comment-username">{comment.user.username}</span>
        </Link>
        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <div className="comment-content-text">
        <p>{comment.content}</p>
      </div>
      <div className="comment-actions">
        {/* Botões de avaliação no comentário */}
        <button
          className={`comment-action-button like-button ${userCommentInteraction === 'liked' ? 'active' : ''}`}
          onClick={handleCommentLike}
        >
          👍 {currentCommentLikes}
        </button>
        <button
          className={`comment-action-button dislike-button ${userCommentInteraction === 'disliked' ? 'active' : ''}`}
          onClick={handleCommentDislike}
        >
          👎 {currentCommentDislikes}
        </button>
        
        {/* Botão de Responder */}
        <button className="comment-action-button reply-button" onClick={() => setShowReplyForm(!showReplyForm)}>
          Responder
        </button>
      </div>

      {/* Formulário de Resposta (visível se showReplyForm for true) */}
      {showReplyForm && (
        <CreateCommentForm
          postId={postId}
          parentId={comment.id} // Este comentário é o pai da nova resposta
          onCommentCreated={(newReply) => {
            onReplyCreated(newReply, comment.id); // Callback para adicionar a resposta ao comentário pai
            setShowReplyForm(false); // Fecha o formulário após criar a resposta
          }}
          isReply={true} // Indica que é um formulário de resposta
        />
      )}

      {/* Renderiza respostas recursivamente */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId} // Passa o ID da postagem para a resposta também
              onReplyCreated={onReplyCreated} // Passa o callback para respostas aninhadas
              level={level + 1} // Incrementa o nível de aninhamento
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;