import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Posts.css'; // Vamos criar este arquivo CSS

const Posts = ({ post }) => {
  // Simplesmente desestrutura as propriedades da postagem para facilitar o uso
  const { id, user, createdAt, contentType, content, imageUrl, videoUrl, likes, dislikes, commentsCount } = post;

  return (
    <div className="post-card">
      <div className="post-header">
        {/* Link para o perfil do usuário que fez a postagem */}
        <Link to={`/profile/${user.username}`} className="post-user-link">
          <img src={user.profilePicUrl} alt={user.username} className="post-user-pic" />
          <span className="post-username">{user.username}</span>
        </Link>
        <span className="post-date">{new Date(createdAt).toLocaleString()}</span>
      </div>

      <div className="post-content">
        {contentType === 'text' && <p>{content}</p>}
        {contentType === 'image' && (
          <>
            {content && <p>{content}</p>} {/* Texto opcional com imagem */}
            <img src={imageUrl} alt="Postagem" className="post-image" />
          </>
        )}
        {contentType === 'video' && (
          <>
            {content && <p>{content}</p>} {/* Texto opcional com vídeo */}
            <video controls src={videoUrl} className="post-video"></video>
          </>
        )}
      </div>

      <div className="post-actions">
        <button className="action-button like-button">👍 {likes}</button>
        <button className="action-button dislike-button">👎 {dislikes}</button>
        <button className="action-button comment-button">💬 {commentsCount} Comentários</button>
      </div>
    </div>
  );
};

export default Posts;