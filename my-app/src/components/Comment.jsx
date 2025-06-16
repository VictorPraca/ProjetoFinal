import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import CreateComment from './CreateComment.jsx';
import '../styles/Comment.css';


const Comment = ({ comment, postId, onReplyCreated, level = 0 }) => {
  const { user: currentUser } = useAuth(); 
  const [showReplyForm, setShowReplyForm] = useState(false); 
  const [currentCommentLikes, setCurrentCommentLikes] = useState(comment.likes || 0);
  const [currentCommentDislikes, setCurrentCommentDislikes] = useState(comment.dislikes || 0);
  const [userCommentInteraction, setUserCommentInteraction] = useState(null); 

  const handleCommentLike = () => {
    if (!currentUser) { alert('Faça login para avaliar comentários.'); return; }
    if (userCommentInteraction === 'liked') { setCurrentCommentLikes(prev => prev - 1); setUserCommentInteraction(null); }
    else { setCurrentCommentLikes(prev => prev + 1); if (userCommentInteraction === 'disliked') setCurrentCommentDislikes(prev => prev - 1); setUserCommentInteraction('liked'); }
  };

  const handleCommentDislike = () => {
    if (!currentUser) { alert('Faça login para avaliar comentários.'); return; }
    if (userCommentInteraction === 'disliked') { setCurrentCommentDislikes(prev => prev - 1); setUserCommentInteraction(null); }
    else { setCurrentCommentDislikes(prev => prev + 1); if (userCommentInteraction === 'liked') setCurrentCommentLikes(prev => prev - 1); setUserCommentInteraction('disliked'); }
  };

  if (level > 3) return null; 

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
        
        <button className="comment-action-button reply-button" onClick={() => setShowReplyForm(!showReplyForm)}>
          Responder
        </button>
      </div>

      {showReplyForm && (
        <CreateComment
          postId={postId}
          parentId={comment.id} 
          onCommentCreated={(newReply) => {
            onReplyCreated(newReply, comment.id); 
            setShowReplyForm(false); 
          }}
          isReply={true} 
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId} 
              onReplyCreated={onReplyCreated} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;