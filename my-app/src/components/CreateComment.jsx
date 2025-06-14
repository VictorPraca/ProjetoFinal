import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js'; // Mesmo que simulado
import '../styles/CreateComment.css';

const CreateComment = ({ postId, parentId = null, onCommentCreated, isReply = false }) => {
  const { user: currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← Impede recarregamento da página
    setIsSubmitting(true);
    setError('');

    console.log('CreateComment: Enviando comentário como', currentUser);

    if (!currentUser) {
      setError('Você precisa estar logado para comentar.');
      setIsSubmitting(false);
      return;
    }

    if (!commentContent.trim()) {
      setError('O comentário não pode ser vazio.');
      setIsSubmitting(false);
      return;
    }

    try {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        content: commentContent.trim(),
        createdAt: new Date().toISOString(),
        user: {
          username: currentUser.username,
          profilePicUrl: currentUser.profilePicUrl || '/default.png'
        },
        replies: []
      };

      // Simulação de envio à API
      console.log('CreateComment: Simulando envio...');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (onCommentCreated) {
        onCommentCreated(newComment);
      }

      setCommentContent('');
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      setError('Não foi possível enviar o comentário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`create-comment-form-container ${isReply ? 'is-reply-form' : ''}`}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={isReply ? 'Digite sua resposta...' : 'Adicione um comentário...'}
          rows={isReply ? "2" : "3"}
          className="comment-textarea"
        ></textarea>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="submit-comment-button">
          {isSubmitting ? 'Enviando...' : (isReply ? 'Responder' : 'Comentar')}
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
