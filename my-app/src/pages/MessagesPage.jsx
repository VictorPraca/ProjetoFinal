// src/pages/MessagesPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Incluindo useRef para scroll do chat
import Header from '../components/Header.jsx';
import api from '../services/api.js'; // Para simular chamadas ao backend
import { Link } from 'react-router-dom'; // Para links para perfis
import { useAuth } from '../contexts/AuthContext.jsx'; // Para obter o usuário logado
import '../styles/MessagesPage.css'; // Vamos criar este CSS
import MessageBubble from '../components/MessageBubble.jsx';

// --- DADOS MOCKADOS (SIMULAÇÃO DO BACKEND) ---

// Reutilizar o MOCK_USER do AuthContext
const MOCK_CURRENT_USER = {
  id: 'user-simulado-123',
  username: 'usuarioSimulado',
  profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const MOCK_PARTICIPANT_USER = {
  id: 'outro-user-id',
  username: 'outroUsuario',
  profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/147/147133.png',
};

const MOCK_CONVERSATIONS = [
  {
    id: 'conv1',
    participants: [MOCK_CURRENT_USER, MOCK_PARTICIPANT_USER],
    lastMessage: {
      senderId: MOCK_PARTICIPANT_USER.id,
      content: 'Olá! Tudo bem?',
      timestamp: new Date('2025-06-11T14:30:00Z').toISOString(),
    },
  },
  {
    id: 'conv2',
    participants: [MOCK_CURRENT_USER, { id: 'terceiro-user-id', username: 'terceiroUser', profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png' }],
    lastMessage: {
      senderId: 'terceiro-user-id',
      content: 'Você viu a última novidade?',
      timestamp: new Date('2025-06-10T10:00:00Z').toISOString(),
    },
  },
];

const MOCK_MESSAGES = {
  'conv1': [
    { id: 'msg1', conversationId: 'conv1', senderId: MOCK_CURRENT_USER.id, receiverId: MOCK_PARTICIPANT_USER.id, content: 'Olá! Tudo bem?', timestamp: new Date('2025-06-11T14:28:00Z').toISOString(), status: 'lida' },
    { id: 'msg2', conversationId: 'conv1', senderId: MOCK_PARTICIPANT_USER.id, receiverId: MOCK_CURRENT_USER.id, content: 'Olá! Tudo bem?', timestamp: new Date('2025-06-11T14:30:00Z').toISOString(), status: 'lida' },
    { id: 'msg3', conversationId: 'conv1', senderId: MOCK_CURRENT_USER.id, receiverId: MOCK_PARTICIPANT_USER.id, content: 'Tudo sim, e com você? Estou testando as mensagens da rede social!', timestamp: new Date('2025-06-11T14:31:00Z').toISOString(), status: 'recebida' },
    { id: 'msg4', conversationId: 'conv1', senderId: MOCK_PARTICIPANT_USER.id, receiverId: MOCK_CURRENT_USER.id, content: 'Que legal! Parece que está funcionando muito bem!', timestamp: new Date('2025-06-11T14:32:00Z').toISOString(), status: 'enviada' },
  ],
  'conv2': [
    { id: 'msg5', conversationId: 'conv2', senderId: MOCK_CURRENT_USER.id, receiverId: 'terceiro-user-id', content: 'Oi! Qual novidade?', timestamp: new Date('2025-06-10T09:58:00Z').toISOString(), status: 'lida' },
    { id: 'msg6', conversationId: 'conv2', senderId: 'terceiro-user-id', receiverId: MOCK_CURRENT_USER.id, content: 'Você viu a última novidade?', timestamp: new Date('2025-06-10T10:00:00Z').toISOString(), status: 'enviada' },
  ],
};
// --- FIM DOS DADOS MOCKADOS ---

const MessagesPage = () => {
  const { user: currentUser } = useAuth(); // Obtém o usuário logado
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [errorConversations, setErrorConversations] = useState(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null); // Ref para manter o scroll do chat no final

  // Efeito para carregar as conversas
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      setErrorConversations(null);
      console.log('MessagesPage: Buscando conversas (Simulado)...');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setConversations(MOCK_CONVERSATIONS);
        // Opcional: Selecionar a primeira conversa por padrão
        if (MOCK_CONVERSATIONS.length > 0) {
          setSelectedConversationId(MOCK_CONVERSATIONS[0].id);
        }
        console.log('MessagesPage: Conversas simuladas carregadas.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar conversas (simulado):', err);
        setErrorConversations('Não foi possível carregar as conversas.');
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  // Efeito para carregar as mensagens da conversa selecionada
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId) {
        setCurrentMessages([]);
        return;
      }
      setLoadingMessages(true);
      setErrorMessages(null);
      console.log(`MessagesPage: Buscando mensagens para ${selectedConversationId} (Simulado)...`);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const messages = MOCK_MESSAGES[selectedConversationId] || [];
        setCurrentMessages(messages);
        console.log('MessagesPage: Mensagens simuladas carregadas.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar mensagens (simulado):', err);
        setErrorMessages('Não foi possível carregar as mensagens.');
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedConversationId]); // Roda sempre que a conversa selecionada muda

  // Efeito para manter o scroll no final do chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]); // Rola para o final sempre que novas mensagens chegam

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !currentUser) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Limpa o input

    const tempMessage = {
      id: `temp-${Date.now()}`, // ID temporário
      conversationId: selectedConversationId,
      senderId: currentUser.id,
      receiverId: 'mock_receiver_id', // Para fins de mock, em real seria o outro participante
      content: messageContent,
      timestamp: new Date().toISOString(),
      status: 'enviando', // Status temporário
    };

    // Adiciona a mensagem temporária ao chat para feedback imediato
    setCurrentMessages(prev => [...prev, tempMessage]);

    try {
      console.log('MessagesPage: Enviando mensagem (Simulado)...');
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula atraso do envio

      // --- SIMULAÇÃO: No backend, a mensagem seria persistida e um ID real seria retornado ---
      const realMessage = { ...tempMessage, id: `real-${Date.now()}`, status: 'enviada' };
      setCurrentMessages(prev => prev.map(msg => msg.id === tempMessage.id ? realMessage : msg));
      console.log('MessagesPage: Mensagem simulada enviada.');

    } catch (err) {
      console.error('MessagesPage: Erro ao enviar mensagem (simulado):', err);
      setErrorMessages('Erro ao enviar mensagem.');
      setCurrentMessages(prev => prev.filter(msg => msg.id !== tempMessage.id)); // Remove a mensagem temporária
    }
  };

  const getParticipantName = (conversation) => {
    // Encontra o outro participante na conversa
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant ? otherParticipant.username : 'Conversa Desconhecida';
  };

  const getParticipantPic = (conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant ? otherParticipant.profilePicUrl : 'https://via.placeholder.com/40?text=NA';
  };


  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);


  return (
    <div>
      <Header />
      <div className="messages-page-container"> {/* Contêiner principal */}
        <div className="conversations-list">
          <h2>Mensagens</h2>
          {loadingConversations && <p>Carregando conversas...</p>}
          {errorConversations && <p className="error-message">{errorConversations}</p>}
          {!loadingConversations && !errorConversations && conversations.length === 0 && (
            <p>Nenhuma conversa encontrada.</p>
          )}
          {!loadingConversations && conversations.length > 0 && (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === selectedConversationId ? 'selected' : ''}`}
                onClick={() => setSelectedConversationId(conv.id)}
              >
                <img src={getParticipantPic(conv)} alt="Perfil" className="conversation-pic" />
                <div className="conversation-info">
                  <h3>{getParticipantName(conv)}</h3>
                  <p className="last-message">{conv.lastMessage?.content}</p>
                  <span className="last-message-time">{new Date(conv.lastMessage?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chat-area">
          {selectedConversationId ? (
            <>
              <div className="chat-header">
                <img src={getParticipantPic(selectedConversation)} alt="Perfil" className="chat-header-pic" />
                <h3>{getParticipantName(selectedConversation)}</h3>
              </div>
              <div className="messages-display">
                {loadingMessages && <p>Carregando mensagens...</p>}
                {errorMessages && <p className="error-message">{errorMessages}</p>}
                {!loadingMessages && currentMessages.length === 0 && (
                  <p>Nenhuma mensagem nesta conversa.</p>
                )}
                {!loadingMessages && currentMessages.length > 0 && (
                  currentMessages.map(msg => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isCurrentUser={msg.senderId === currentUser.id}
                    />
                  ))
                )}
                <div ref={messagesEndRef} /> {/* Elemento para scroll */}
              </div>
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="message-input"
                />
                <button type="submit" className="send-button">Enviar</button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Selecione uma conversa para começar a conversar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;