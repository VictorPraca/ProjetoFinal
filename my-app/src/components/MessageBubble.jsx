import React from 'react';

// Este componente é para exibir uma única bolha de mensagem
const MessageBubble = ({ message, isCurrentUser, currentUser, partnerUser, BASE_BACKEND_URL, DEFAULT_USER_PROFILE_PIC }) => {
  // Determine a foto de perfil a ser exibida na bolha (do remetente da mensagem)
  const senderProfilePic = message.Sender?.profilePicture 
    ? `${BASE_BACKEND_URL}${message.Sender.profilePicture}` 
    : DEFAULT_USER_PROFILE_PIC;

  // Determine o nome do remetente
  const senderName = message.Sender?.username || 'Usuário Desconhecido';

  return (
    <div className={`message-item ${isCurrentUser ? 'sent' : 'received'}`}>
      <img 
        src={senderProfilePic} 
        alt={senderName} 
        className="message-profile-pic" 
      />
      <div className="message-content-bubble">
        {/* Mostra o nome do remetente apenas se a mensagem for recebida (não do usuário atual) */}
        {!isCurrentUser && <span className="message-sender-name">{senderName}</span>}
        <p>{message.content}</p>
        <span className="message-timestamp">{new Date(message.sentAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
