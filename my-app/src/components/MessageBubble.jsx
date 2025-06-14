// src/components/MessageBubble.jsx
import React from 'react';
import '../styles/MessagesPage.css'; // O CSS das mensagens estará no CSS da página

const MessageBubble = ({ message, isCurrentUser }) => {
  const messageClass = isCurrentUser ? 'message-bubble current-user' : 'message-bubble other-user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={messageClass}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
      <span className="message-timestamp">{timestamp}</span>
      {/* Opcional: Icone de status da mensagem (enviada, recebida, lida) */}
      {/* {isCurrentUser && message.status === 'lida' && <span className="message-status">✓✓</span>} */}
    </div>
  );
};

export default MessageBubble;