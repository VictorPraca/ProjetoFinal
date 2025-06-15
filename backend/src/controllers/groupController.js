const { Group, GroupMember } = require('../models/groupModel');
const GroupMessage = require('../models/groupMessageModel');
const User = require('../models/userModel');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user; // O criador é o primeiro administrador

    const newGroup = await Group.create({ name, description, creatorId });
    await GroupMember.create({ groupId: newGroup.id, userId: creatorId, role: 'administrator' });

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const existingMember = await GroupMember.findOne({ where: { groupId, userId } });
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this group.' });
    }

    await GroupMember.create({ groupId, userId, role: 'member' });
    res.status(200).json({ message: 'Successfully joined the group.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user; // Para verificar se o usuário é membro do grupo

        const isMember = await GroupMember.findOne({ where: { groupId, userId } });
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this group.' });
        }

        const messages = await GroupMessage.findAll({
            where: { groupId },
            include: [{ model: User, attributes: ['username', 'profilePicture'] }],
            order: [['createdAt', 'ASC']],
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postGroupMessage = async (req, res) => {
    try {
        const { groupId, content } = req.body;
        const userId = req.user;

        const isMember = await GroupMember.findOne({ where: { groupId, userId } });
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this group.' });
        }

        const newMessage = await GroupMessage.create({ groupId, userId, content });
        res.status(201).json({ message: 'Message posted in group.', message: newMessage });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteGroupMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.user;

        const message = await GroupMessage.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        const groupMember = await GroupMember.findOne({ where: { groupId: message.groupId, userId } });

        // Apenas administradores podem apagar mensagens de outros membros
        if (message.userId === userId || (groupMember && groupMember.role === 'administrator')) {
            await message.destroy();
            return res.status(200).json({ message: 'Message deleted successfully.' });
        } else {
            return res.status(403).json({ message: 'You are not authorized to delete this message.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};