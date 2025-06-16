import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header.jsx';
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import '../styles/MessagesPage.css';
import MessageBubble from '../components/MessageBubble.jsx'; // Certifique-se de que este componente existe

// Base URL para imagens de perfil (do backend)
const BASE_BACKEND_URL = 'http://localhost:5000';
// URL de imagem de perfil padrão (se o usuário não tiver uma)
const DEFAULT_USER_PROFILE_PIC = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

const MessagesPage = () => {
  const { isAuthenticated, user: currentUser } = useAuth(); // Obtém o usuário logado do contexto
  
  const [partners, setPartners] = useState([]); // Lista de usuários com quem o currentUser conversou
  const [selectedPartnerId, setSelectedPartnerId] = useState(null); // ID do parceiro de conversa selecionado
  const [conversation, setConversation] = useState([]); // Mensagens da conversa selecionada
  const [newMessage, setNewMessage] = useState(''); // Texto da nova mensagem a ser enviada

  const [loadingPartners, setLoadingPartners] = useState(true);
  const [errorPartners, setErrorPartners] = useState(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [errorConversation, setErrorConversation] = useState(null);

  const messagesEndRef = useRef(null); // Ref para manter o scroll do chat no final

  // Efeito para buscar a lista de parceiros de conversa do backend
  useEffect(() => {
    const fetchPartners = async () => {
      setLoadingPartners(true);
      setErrorPartners(null);
      
      // Só busca parceiros se o usuário estiver autenticado
      if (!isAuthenticated || !currentUser) {
        setLoadingPartners(false);
        setErrorPartners('Você precisa estar logado para ver suas mensagens.');
        return;
      }
      
      console.log('MessagesPage: Buscando parceiros de conversa do backend...');
      try {
        const response = await api.get('/api/messages/partners'); // Chama a API do backend
        setPartners(response.data);
        
        // Se houver parceiros, seleciona o primeiro por padrão para exibir a conversa
        if (response.data.length > 0) {
          setSelectedPartnerId(response.data[0].id);
        } else {
          setSelectedPartnerId(null); // Nenhum parceiro para selecionar
        }
        console.log('MessagesPage: Parceiros de conversa carregados do backend.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar parceiros de conversa do backend:', err.response?.data || err.message);
        setErrorPartners('Não foi possível carregar seus parceiros de conversa.');
      } finally {
        setLoadingPartners(false);
      }
    };
    
    fetchPartners(); // Chama a função ao montar o componente ou quando o status de autenticação muda
  }, [isAuthenticated, currentUser]); // Depende do status de autenticação do usuário

  // Efeito para buscar as mensagens da conversa selecionada do backend
  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedPartnerId || !isAuthenticated || !currentUser) {
        setConversation([]); // Limpa a conversa se não houver parceiro selecionado ou não estiver autenticado
        return;
      }
      setLoadingConversation(true);
      setErrorConversation(null);
      
      console.log(`MessagesPage: Buscando mensagens para o parceiro ID: ${selectedPartnerId} do backend...`);
      try {
        const response = await api.get(`/api/messages/conversation/${selectedPartnerId}`); // Chama a API do backend
        setConversation(response.data);
        console.log('MessagesPage: Mensagens carregadas do backend.');
      } catch (err) {
        console.error('MessagesPage: Erro ao buscar conversa do backend:', err.response?.data || err.message);
        setErrorConversation('Não foi possível carregar a conversa.');
      } finally {
        setLoadingConversation(false);
      }
    };
    
    fetchConversation(); // Roda sempre que o parceiro selecionado ou o status de autenticação muda
  }, [selectedPartnerId, isAuthenticated, currentUser]);

  // Efeito para manter o scroll no final do chat quando novas mensagens chegam
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]); // Rola para o final sempre que a lista de mensagens é atualizada

  // Função para enviar uma nova mensagem
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página ao submeter o formulário
    
    if (!newMessage.trim() || !selectedPartnerId || !isAuthenticated || !currentUser) {
      alert('Não é possível enviar uma mensagem vazia ou sem destinatário.');
      return;
    }
    
    const messageContent = newMessage.trim();
    setNewMessage(''); // Limpa o input imediatamente

    try {
      console.log('MessagesPage: Enviando mensagem para o backend...');
      const response = await api.post('/api/messages', {
        receiverId: selectedPartnerId, // ID do destinatário
        content: messageContent, // Conteúdo da mensagem
      });
      
      // Adiciona a nova mensagem (retornada pelo backend) à conversa atual no frontend
      setConversation(prev => [...prev, response.data.privateMessage]);
      console.log('Mensagem enviada com sucesso e persistida:', response.data.privateMessage);
    } catch (err) {
      console.error('MessagesPage: Erro ao enviar mensagem para o backend:', err.response?.data || err.message);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  // Funções auxiliares para obter nome e foto do participante (baseado na lista 'partners')
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

  // Se o usuário não está logado, mostra uma mensagem de prompt
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="messages-page-container">
        <Header />
        <p className="auth-prompt">Faça login para ver suas mensagens privadas.</p>
      </div>
    );
  }

  // Layout principal da página de mensagens
  return (
    <div className="messages-page-container">
      <Header />
      <div className="messages-layout">
        {/* Coluna da esquerda: Lista de Parceiros de Conversa */}
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
                    {/* Exibir última mensagem aqui se o backend retornar em partners */}
                    {/* <p className="last-message">{partner.lastMessage?.content}</p> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coluna da direita: Área de Conversa / Chat */}
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
                    <MessageBubble // Componente para cada bolha de mensagem
                      key={msg.id}
                      message={msg} // Objeto de mensagem completo
                      isCurrentUser={msg.senderId === currentUser.id} // Verifica se a mensagem é do usuário logado
                      currentUser={currentUser} // Passa o currentUser para a bolha ter seus dados
                      partnerUser={msg.senderId === currentUser.id ? getPartnerInfo(msg.receiverId) : getPartnerInfo(msg.senderId)} // O outro usuário na mensagem
                      BASE_BACKEND_URL={BASE_BACKEND_URL} // Passa para montar a URL da foto
                      DEFAULT_USER_PROFILE_PIC={DEFAULT_USER_PROFILE_PIC} // Passa para foto padrão
                    />
                  ))
                )}
                <div ref={messagesEndRef} /> {/* Elemento para scroll automático */}
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
