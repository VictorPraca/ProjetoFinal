const PrivateMessage = require('../models/privateMessageModel');
const User = require('../models/userModel');
const { Op, Sequelize } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'O conteúdo da mensagem não pode ser vazio.' });
    }
    if (senderId === parseInt(receiverId, 10)) { 
        return res.status(400).json({ message: 'Não é possível enviar uma mensagem para si mesmo.' });
    }


    const receiverExists = await User.findByPk(receiverId);
    if (!receiverExists) {
        return res.status(404).json({ message: 'Destinatário não encontrado.' });
    }

    const newMessage = await PrivateMessage.create({ senderId, receiverId, content });

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

exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;
    const currentUserId = req.user.id;

    if (!otherUserId || isNaN(parseInt(otherUserId, 10))) {
        return res.status(400).json({ message: 'ID do outro usuário inválido.' });
    }

    const conversation = await PrivateMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },

      include: [
        { model: User, as: 'Sender', attributes: ['id', 'username', 'profilePicture'] },
        { model: User, as: 'Receiver', attributes: ['id', 'username', 'profilePicture'] },
      ],
      order: [['sentAt', 'ASC']], 
    });

    await PrivateMessage.update(
      { status: 'read' },
      {
        where: {
          senderId: otherUserId, 
          receiverId: currentUserId, 
          status: { [Op.in]: ['sent', 'received'] }, 
        },
      }
    );

    res.json(conversation);
  } catch (error) {
    console.error('Erro ao obter conversa privada:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter conversa privada.' });
  }
};

exports.getConversationPartners = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const sentToPartners = await PrivateMessage.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('receiverId')), 'partnerId']],
      where: { senderId: currentUserId },
      raw: true 
    });

    const receivedFromPartners = await PrivateMessage.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('senderId')), 'partnerId']],
      where: { receiverId: currentUserId },
      raw: true
    });

    const allPartnerIds = new Set();
    sentToPartners.forEach(p => allPartnerIds.add(p.partnerId));
    receivedFromPartners.forEach(p => allPartnerIds.add(p.partnerId));

    allPartnerIds.delete(currentUserId);

    if (allPartnerIds.size === 0) {
        return res.json([]);
    }

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