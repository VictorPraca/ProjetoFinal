import React from 'react';

const MessageBubble = ({ message, isCurrentUser, BASE_BACKEND_URL, DEFAULT_USER_PROFILE_PIC }) => {

  const senderProfilePic = message.Sender?.profilePicture 
    ? `${BASE_BACKEND_URL}${message.Sender.profilePicture}` 
    : DEFAULT_USER_PROFILE_PIC;


  const senderName = message.Sender?.username || 'Usuário Desconhecido';

  const getStatusText = (status) => {
    switch (status) {
      case 'sent':
        return '✓ Enviada';
      case 'received':
        return '✓✓ Entregue';
      case 'read':
        return '✓✓ Lida';
      default:
        return '';
    }
  };

  return (
    <div className={`message-item ${isCurrentUser ? 'sent' : 'received'}`}>
      <img 
        src={senderProfilePic} 
        alt={senderName} 
        className="message-profile-pic" 
      />
      <div className="message-content-bubble">
        {!isCurrentUser && <span className="message-sender-name">{senderName}</span>}
        <p>{message.content}</p>
        <span className="message-timestamp">
          {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isCurrentUser && ( 
            <span className="message-status"> {getStatusText(message.status)}</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
