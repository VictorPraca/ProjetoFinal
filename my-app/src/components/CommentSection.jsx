// my-app/src/components/CommentSection.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/CommentSection.css';
import { Link } from 'react-router-dom'; // <-- Importa o Link

const BASE_BACKEND_URL = 'http://localhost:5000';
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const CommentSection = ({ postId, onCommentAdded }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const response = await api.get(`/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Erro ao buscar comentários:', err.response?.data || err.message);
        setErrorComments('Não foi possível carregar os comentários.');
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (parentId = null) => {
    if (!isAuthenticated || !user) {
      alert('Você precisa estar logado para comentar.');
      return;
    }
    if (!newCommentText.trim()) {
      alert('Seu comentário não pode ser vazio.');
      return;
    }

    try {
      const response = await api.post('/api/posts/interact/comment', {
        postId,
        content: newCommentText.trim(),
        parentId,
      });
      
      const addedComment = response.data.comment;
      
      if (parentId) {
        setComments(prevComments => 
            prevComments.map(comment => 
                comment.id === parentId 
                    ? { ...comment, Replies: [...(comment.Replies || []), addedComment] }
                    : comment
            )
        );
      } else {
        setComments(prevComments => [addedComment, ...prevComments]);
      }
      
      setNewCommentText('');
      setReplyingTo(null);
      onCommentAdded(addedComment);
      console.log('Comentário adicionado:', addedComment);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error.response?.data || error.message);
      alert('Erro ao adicionar comentário. Tente novamente.');
    }
  };

  const handleToggleCommentLikeDislike = async (commentId, type) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para interagir.');
      return;
    }
    try {
      const response = await api.post('/api/posts/interact/toggle-like-dislike', { commentId, type });
      
      setComments(prevComments => {
        const updateComment = (commentList) => {
          return commentList.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: response.data.likes,
                dislikes: response.data.dislikes,
                userHasInteracted: response.data.userInteractionType
              };
            }
            if (comment.Replies && comment.Replies.length > 0) {
              return {
                ...comment,
                Replies: updateComment(comment.Replies) 
              };
            }
            return comment;
          });
        };
        return updateComment(prevComments);
      });
      console.log(response.data.message);

    } catch (error) {
      console.error(`Erro ao ${type} no comentário:`, error.response?.data || error.message);
      alert(`Erro ao ${type} o comentário. Tente novamente.`);
    }
  };

  const renderComments = (commentList, level = 0) => {
    return commentList.map(comment => (
      <div key={comment.id} className={`comment-item level-${level}`}>
        <div className="comment-header">
          <img 
            src={comment.User?.profilePicture ? `${BASE_BACKEND_URL}${comment.User.profilePicture}` : DEFAULT_USER_PROFILE_PIC} 
            alt={comment.User?.username || 'User'} 
            className="comment-profile-pic" 
          />
          <div className="comment-info">
            {/* MUDANÇA AQUI: Envolve o nome de usuário com o Link */}
            <h4>
              <Link to={`/profile/${comment.User?.username}`}> {/* Link para o perfil do comentador */}
                {comment.User?.username}
              </Link>
            </h4>
            <span>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <p>{comment.commentContent}</p>
        
        <div className="comment-interactions">
            <span 
                className={`comment-likes ${comment.userHasInteracted === 'like' ? 'liked' : ''}`}
                onClick={() => handleToggleCommentLikeDislike(comment.id, 'like')}
            >
                👍 {comment.likes || 0}
            </span>
            <span 
                className={`comment-dislikes ${comment.userHasInteracted === 'dislike' ? 'disliked' : ''}`}
                onClick={() => handleToggleCommentLikeDislike(comment.id, 'dislike')}
            >
                👎 {comment.dislikes || 0}
            </span>
            {isAuthenticated && (
                <button className="reply-button" onClick={() => setReplyingTo(comment.id)}>Responder</button>
            )}
        </div>

        {replyingTo === comment.id && (
            <div className="reply-form">
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escreva sua resposta..."
                    rows="2"
                ></textarea>
                <button onClick={() => handleAddComment(comment.id)}>Enviar Resposta</button>
                <button onClick={() => { setNewCommentText(''); setReplyingTo(null); }}>Cancelar</button>
            </div>
        )}

        {comment.Replies && comment.Replies.length > 0 && (
          <div className="comment-replies">
            {renderComments(comment.Replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="comment-section">
      <div className="comment-input-area">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Escreva um comentário..."
          rows="3"
        ></textarea>
        <button onClick={() => handleAddComment()}>Comentar</button>
      </div>

      {loadingComments && <p>Carregando comentários...</p>}
      {errorComments && <p style={{ color: 'red' }}>{errorComments}</p>}
      {!loadingComments && comments.length === 0 && !errorComments && <p>Nenhum comentário ainda.</p>}
      
      <div className="comments-list">
        {renderComments(comments)}
      </div>
    </div>
  );
};

export default CommentSection;
