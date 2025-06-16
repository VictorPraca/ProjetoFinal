const PrivateMessage = require('../models/privateMessageModel');
const User = require('../models/userModel');
const { Op, Sequelize } = require('sequelize'); // Importa o operador Op do Sequelize e Sequelize para funções

// Controlador para enviar uma mensagem privada
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // ID do usuário logado

    // Validações básicas
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'O conteúdo da mensagem não pode ser vazio.' });
    }
    if (senderId === parseInt(receiverId, 10)) { // Converte receiverId para número para comparação
        return res.status(400).json({ message: 'Não é possível enviar uma mensagem para si mesmo.' });
    }

    // Verifica se o destinatário existe
    const receiverExists = await User.findByPk(receiverId);
    if (!receiverExists) {
        return res.status(404).json({ message: 'Destinatário não encontrado.' });
    }

    // Cria e salva a nova mensagem privada no banco de dados
    const newMessage = await PrivateMessage.create({ senderId, receiverId, content });

    // Opcional: Popular a mensagem com os dados do remetente e destinatário para retorno imediato
    const populatedMessage = await PrivateMessage.findByPk(newMessage.id, {
        include: [
            { model: User, as: 'Sender', attributes: ['id', 'username', 'profilePicture'] },
            { model: User, as: 'Receiver', attributes: ['id', 'username', 'profilePicture'] }
        ]
    });

    res.status(201).json({ message: 'Mensagem enviada com sucesso', privateMessage: populatedMessage });
  } catch (error) {
    console.error('Erro ao enviar mensagem privada:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao enviar mensagem privada.' });
  }
};

// Controlador para obter o histórico de conversas entre dois usuários
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId; // ID do outro usuário na conversa
    const currentUserId = req.user.id; // ID do usuário logado

    // Validação básica do otherUserId
    if (!otherUserId || isNaN(parseInt(otherUserId, 10))) {
        return res.status(400).json({ message: 'ID do outro usuário inválido.' });
    }

    // Busca mensagens onde o remetente OU o destinatário seja o usuário logado
    // E o outro lado da conversa seja o 'otherUserId'
    const conversation = await PrivateMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      // Inclui os dados do remetente e destinatário para display
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'username', 'profilePicture'] },
        { model: User, as: 'Receiver', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['sentAt', 'ASC']], // Ordena as mensagens por data de envio (ascendente)
    });

    // Opcional: Atualizar o status das mensagens recebidas pelo usuário logado para 'read'
    // Isso deve ser feito APÓS a busca da conversa para que o usuário veja as mensagens antes de marcá-las como lidas.
    await PrivateMessage.update(
      { status: 'read' },
      {
        where: {
          senderId: otherUserId, // Mensagens enviadas pelo outro usuário
          receiverId: currentUserId, // Recebidas pelo usuário logado
          status: { [Op.in]: ['sent', 'received'] }, // Que ainda não foram lidas (enviadas ou recebidas)
        },
      }
    );

    res.json(conversation);
  } catch (error) {
    console.error('Erro ao obter conversa privada:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter conversa privada.' });
  }
};

// Controlador para obter todos os usuários com quem o usuário logado conversou (histórico de chats)
exports.getConversationPartners = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // NOVO: Busca IDs de parceiros como remetentes
    const sentToPartners = await PrivateMessage.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('receiverId')), 'partnerId']],
      where: { senderId: currentUserId },
      raw: true // Retorna resultados puros sem instâncias do modelo
    });

    // NOVO: Busca IDs de parceiros como destinatários
    const receivedFromPartners = await PrivateMessage.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('senderId')), 'partnerId']],
      where: { receiverId: currentUserId },
      raw: true
    });

    // Combina e remove duplicatas para obter uma lista única de IDs de parceiros
    const allPartnerIds = new Set();
    sentToPartners.forEach(p => allPartnerIds.add(p.partnerId));
    receivedFromPartners.forEach(p => allPartnerIds.add(p.partnerId));

    // Remove o próprio ID do usuário logado, se ele estiver na lista (improvável mas seguro)
    allPartnerIds.delete(currentUserId);

    // Se não houver parceiros, retorna um array vazio
    if (allPartnerIds.size === 0) {
        return res.json([]);
    }

    // Busca os dados completos dos usuários parceiros
    const conversationPartners = await User.findAll({
      where: { id: { [Op.in]: Array.from(allPartnerIds) } },
      attributes: ['id', 'username', 'profilePicture']
    });

    res.json(conversationPartners);
  } catch (error) {
    console.error('Erro ao obter parceiros de conversa:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter parceiros de conversa.' });
  }
};