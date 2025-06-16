import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';
import '../styles/FeedPage.css';
import { Link } from 'react-router-dom'; // <-- Importa o Link

const BASE_BACKEND_URL = 'http://localhost:5000';
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const Posts = ({ post: initialPost }) => {
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const userProfilePicSrc = post.User?.profilePicture
    ? `${BASE_BACKEND_URL}${post.User.profilePicture}`
    : DEFAULT_USER_PROFILE_PIC;

  const postMediaSrc = post.mediaUrl
    ? `${BASE_BACKEND_URL}${post.mediaUrl}`
    : null;

  const handleToggleLikeDislike = async (type) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para interagir.');
      return;
    }
    try {
      const response = await api.post('/api/posts/interact/toggle-like-dislike', { postId: post.id, type });
      
      setPost(prevPost => ({
          ...prevPost,
          likes: response.data.likes,
          dislikes: response.data.dislikes,
          userHasInteracted: response.data.userInteractionType 
      }));

      console.log(response.data.message);

    } catch (error) {
      console.error(`Erro ao ${type} a postagem:`, error.response?.data || error.message);
      alert(`Erro ao ${type}. Tente novamente.`);
    }
  };

  const handleCommentAdded = (newComment) => {
    setPost(prevPost => ({
        ...prevPost,
        comments: (prevPost.comments || 0) + 1,
    }));
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={userProfilePicSrc} alt={post.User?.username || 'Foto de Perfil'} className="post-profile-pic" />
        <div className="post-info">
          {/* MUDANÇA AQUI: Envolve o nome de usuário com o Link */}
          <h3>
            <Link to={`/profile/${post.User?.username}`}> {/* Link para a página de perfil */}
              {post.User?.username}
            </Link>
          </h3> 
          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}</span>
        </div>
      </div>
      <div className="post-body">
        <p>{post.content}</p>
        {post.contentType === 'image' && postMediaSrc && (
          <img src={postMediaSrc} alt="Mídia da postagem" className="post-media-content" />
        )}
        {post.contentType === 'video' && postMediaSrc && (
          <video controls className="post-media-content">
            <source src={postMediaSrc} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        )}
      </div>
      <div className="post-footer">
        <span 
          className={`post-likes ${post.userHasInteracted === 'like' ? 'liked' : ''}`}
          onClick={() => handleToggleLikeDislike('like')}
        >
          👍 {post.likes || 0}
        </span>
        <span 
          className={`post-dislikes ${post.userHasInteracted === 'dislike' ? 'disliked' : ''}`}
          onClick={() => handleToggleLikeDislike('dislike')}
        >
          👎 {post.dislikes || 0}
        </span>
        <span 
          className={`post-comments ${showComments ? 'active-comments' : ''}`}
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments || 0} Comentários
        </span>
      </div>
      {showComments && (
        <CommentSection postId={post.id} onCommentAdded={handleCommentAdded} />
      )}
    </div>
  );
};

export default Posts;
