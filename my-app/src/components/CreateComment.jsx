import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Para obter o usuário logado
import api from '../services/api.js'; // Para simular o envio do comentário
import '../styles/CreateComment.css'; // O CSS para este formulário

const CreateComment= ({ postId, parentId = null, onCommentCreated, isReply = false }) => {
  const { user: currentUser } = useAuth(); // Obtém o usuário logado
  // --- Adicione este console.log ---
  console.log('CreateCommentForm: Renderizando, currentUser:', currentUser);

  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // --- Adicione este console.log ---
    console.log('CreateCommentForm: handleSubmit chamado. currentUser:', currentUser);

    if (!currentUser) {
      setError('Você precisa estar logado para comentar.');
      setIsSubmitting(false);
      return; // Sai da função aqui se não estiver logado
    }
    if (!commentContent.trim()) {
      setError('O comentário não pode ser vazio.');
      setIsSubmitting(false);
      return;
    }

    try {
      const newComment = { /* ... */ };
      console.log('CreateCommentForm: Enviando comentário (Simulado)...');
      await new Promise(resolve => setTimeout(resolve, 800));

      if (onCommentCreated) {
        onCommentCreated(newComment);
      }
      setCommentContent('');

    } catch (err) {
      console.error('CreateCommentForm: Erro REAL ao enviar comentário (simulado):', err); // Mensagem mais específica
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
          rows={isReply ? "2" : "3"} // Respostas podem ser menores
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