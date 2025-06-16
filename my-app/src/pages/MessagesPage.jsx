import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/MessagesPage.css';
import MessageBubble from '../components/MessageBubble.jsx';

const BASE_BACKEND_URL = 'http://localhost:5000';
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const MessagesPage = () => {
  const { isAuthenticated, user: currentUser } = useAuth();
  
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [loadingPartners, setLoadingPartners] = useState(true);
  const [errorPartners, setErrorPartners] = useState(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [errorConversation, setErrorConversation] = useState(null); 

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoadingPartners(true);
      setErrorPartners(null);
      
      if (!isAuthenticated || !currentUser) {
        setLoadingPartners(false);
        setErrorPartners('Você precisa estar logado para ver suas mensagens.');
        return;
      }
      
      console.log('MessagesPage: Buscando parceiros de conversa do backend...');
      try {
        const response = await api.get('/api/messages/partners');
        setPartners(response.data);
        
        if (response.data.length > 0) {
          setSelectedPartnerId(response.data[0].id);
        } else {
          setSelectedPartnerId(null);
        }
        console.log('MessagesPage: Parceiros de conversa carregados do backend.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar parceiros de conversa do backend:', err.response?.data || err.message);
        setErrorPartners('Não foi possível carregar seus parceiros de conversa.');
      } finally {
        setLoadingPartners(false);
      }
    };
    
    fetchPartners();
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedPartnerId || !isAuthenticated || !currentUser) {
        setConversation([]); 
        return;
      }
      setLoadingConversation(true);
      setErrorConversation(null);
      
      console.log(`MessagesPage: Buscando mensagens para o parceiro ID: ${selectedPartnerId} do backend...`);
      try {
        const response = await api.get(`/api/messages/conversation/${selectedPartnerId}`);
        setConversation(response.data);
        console.log('MessagesPage: Mensagens carregadas do backend.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar conversa do backend:', err.response?.data || err.message);
        setErrorConversation('Não foi possível carregar a conversa.');
      } finally {
        setLoadingConversation(false);
      }
    };
    
    fetchConversation(); 
  }, [selectedPartnerId, isAuthenticated, currentUser]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedPartnerId || !isAuthenticated || !currentUser) {
      alert('Não é possível enviar uma mensagem vazia ou sem destinatário.');
      return;
    }
    
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      console.log('MessagesPage: Enviando mensagem para o backend...');
      const response = await api.post('/api/messages', {
        receiverId: selectedPartnerId,
        content: messageContent,
      });
      
      setConversation(prev => [...prev, response.data.privateMessage]);
      console.log('Mensagem enviada com sucesso e persistida:', response.data.privateMessage);
    } catch (err) {
      console.error('MessagesPage: Erro ao enviar mensagem para o backend:', err.response?.data || err.message);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const getPartnerInfo = (partnerId) => {
    return partners.find(p => p.id === partnerId);
  };
  const getPartnerPic = (partnerId) => {
    const partner = getPartnerInfo(partnerId);
    return partner?.profilePicture ? `${BASE_BACKEND_URL}${partner.profilePicture}` : DEFAULT_USER_PROFILE_PIC;
  };
  const getPartnerName = (partnerId) => {
    const partner = getPartnerInfo(partnerId);
    return partner ? partner.username : 'Usuário Desconhecido';
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="messages-page-container">
        <Header />
        <p className="auth-prompt">Faça login para ver suas mensagens privadas.</p>
      </div>
    );
  }

  return (
    <div className="messages-page-container">
      <Header />
      <div className="messages-layout">
        <div className="partners-list-sidebar">
          <h2>Conversas</h2>
          {loadingPartners && <p>Carregando conversas...</p>}
          {errorPartners && <p style={{ color: 'red' }}>{errorPartners}</p>}
          {!loadingPartners && !errorPartners && partners.length === 0 && (
            <p>Nenhuma conversa encontrada.</p>
          )}
          {!loadingPartners && partners.length > 0 && (
            <ul>
              {partners.map(partner => (
                <li 
                  key={partner.id} 
                  className={`partner-item ${selectedPartnerId === partner.id ? 'active' : ''}`}
                  onClick={() => setSelectedPartnerId(partner.id)}
                >
                  <img 
                    src={getPartnerPic(partner.id)} 
                    alt={partner.username} 
                    className="partner-profile-pic" 
                  />
                  <div className="partner-info-text">
                    <span>{partner.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="chat-area">
          {!selectedPartnerId ? (
            <p className="select-partner-message">Selecione um parceiro para começar a conversar.</p>
          ) : (
            <>
              <div className="chat-header">
                <h3>Conversa com {getPartnerName(selectedPartnerId)}</h3>
              </div>
              <div className="message-list">
                {loadingConversation && <p>Carregando mensagens...</p>}
                {errorConversation && <p style={{ color: 'red' }}>{errorConversation}</p>}
                {!loadingConversation && conversation.length === 0 && (
                  <p>Inicie sua conversa!</p>
                )}
                {!loadingConversation && conversation.length > 0 && (
                  conversation.map(msg => (
                    <MessageBubble 
                      key={msg.id}
                      message={msg}
                      isCurrentUser={msg.senderId === currentUser.id}
                      BASE_BACKEND_URL={BASE_BACKEND_URL}
                      DEFAULT_USER_PROFILE_PIC={DEFAULT_USER_PROFILE_PIC}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="message-input-form">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  rows="2"
                ></textarea>
                <button type="submit">Enviar</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
