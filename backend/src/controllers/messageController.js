const PrivateMessage = require('../models/privateMessageModel');
const User = require('../models/userModel');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user;

    const newMessage = await PrivateMessage.create({ senderId, receiverId, content });
    res.status(201).json({ message: 'Message sent successfully', privateMessage: newMessage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const currentUserId = req.user;

    const conversation = await PrivateMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      include: [
        { model: User, as: 'Sender', attributes: ['username'] },
        { model: User, as: 'Receiver', attributes: ['username'] },
      ],
      order: [['sentAt', 'ASC']],
    });

    // Atualizar o status das mensagens recebidas para 'read'
    await PrivateMessage.update(
      { status: 'read' },
      {
        where: {
          senderId: otherUserId,
          receiverId: currentUserId,
          status: ['sent', 'received'],
        },
      }
    );

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};