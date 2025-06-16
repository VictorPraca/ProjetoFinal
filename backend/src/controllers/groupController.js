const { Group, GroupMember } = require('../models/groupModel');
const GroupMessage = require('../models/groupMessageModel');
const User = require('../models/userModel');
const Post = require('../models/postModel'); 
const Interaction = require('../models/interactionModel'); 
const { Sequelize } = require('sequelize');

exports.createGroup = async (req, res) => { 
  try {
    const { name, description } = req.body;
    const creatorId = req.user.id; 

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'O nome da comunidade não pode ser vazio.' });
    }

    const existingGroup = await Group.findOne({ where: { name: name.trim() } });
    if (existingGroup) {
      return res.status(400).json({ message: 'Já existe uma comunidade com este nome.' });
    }

    const newGroup = await Group.create({ name: name.trim(), description: description.trim(), creatorId });
    await GroupMember.create({ groupId: newGroup.id, userId: creatorId, role: 'administrator' });

    const populatedGroup = await Group.findByPk(newGroup.id, {
      include: [{ model: User, as: 'Creator', attributes: ['id', 'username'] }]
    });

    res.status(201).json({ message: 'Comunidade criada com sucesso', group: populatedGroup });
  } catch (error) {
    console.error('Erro ao criar comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar comunidade.' });
  }
};


exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Comunidade não encontrada.' });
    }

    const existingMember = await GroupMember.findOne({ where: { groupId, userId } });
    if (existingMember) {
      return res.status(400).json({ message: 'Usuário já é membro desta comunidade.' });
    }

    await GroupMember.create({ groupId, userId, role: 'member' });
    res.status(200).json({ message: 'Usuário entrou na comunidade com sucesso.' });
  } catch (error) {
    console.error('Erro ao entrar na comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao entrar na comunidade.' });
  }
};

exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user.id;

        const member = await GroupMember.findOne({ where: { groupId, userId } });
        if (!member) {
            return res.status(404).json({ message: 'Usuário não é membro desta comunidade.' });
        }

        await member.destroy();
        res.status(200).json({ message: 'Usuário saiu da comunidade com sucesso.' });
    } catch (error) {
        console.error('Erro ao sair da comunidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao sair da comunidade.' });
    }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const isMember = await GroupMember.findOne({ where: { groupId, userId } });
    if (!isMember) {
      return res.status(403).json({ message: 'Você não é membro desta comunidade e não pode ver as mensagens.' });
    }

    const messages = await GroupMessage.findAll({
      where: { groupId },
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao obter mensagens da comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter mensagens da comunidade.' });
  }
};

exports.postGroupMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'A mensagem não pode ser vazia.' });
    }

    const isMember = await GroupMember.findOne({ where: { groupId, userId } });
    if (!isMember) {
      return res.status(403).json({ message: 'Você não é membro desta comunidade e não pode postar mensagens.' });
    }

    const newMessage = await GroupMessage.create({ groupId, userId, content });

    const populatedMessage = await GroupMessage.findByPk(newMessage.id, {
        include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }]
    });

    res.status(201).json({ message: 'Mensagem postada na comunidade.', message: populatedMessage });
  } catch (error) {
    console.error('Erro ao postar mensagem na comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao postar mensagem na comunidade.' });
  }
};

exports.deleteGroupMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user.id;

    const message = await GroupMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Mensagem não encontrada.' });
    }

    if (message.userId === userId) {
        await message.destroy();
        return res.status(200).json({ message: 'Sua mensagem foi apagada com sucesso.' });
    }

    const groupMember = await GroupMember.findOne({ where: { groupId: message.groupId, userId } });

    if (groupMember && groupMember.role === 'administrator') {
      await message.destroy();
      return res.status(200).json({ message: 'Mensagem de outro membro apagada por administrador.' });
    } else {
      return res.status(403).json({ message: 'Você não tem permissão para apagar esta mensagem.' });
    }
  } catch (error) {
    console.error('Erro ao apagar mensagem da comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao apagar mensagem da comunidade.' });
  }
};

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{ model: User, as: 'Creator', attributes: ['id', 'username'] }]
        });
        res.json(groups);
    } catch (error) {
        console.error('Erro ao obter todas as comunidades:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter comunidades.' });
    }
};

exports.getGroupDetails = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId, {
            include: [
                { model: User, as: 'Creator', attributes: ['id', 'username'] },
                {
                    model: User,
                    through: { attributes: ['role'] },
                    attributes: ['id', 'username', 'profilePicture']
                }
            ]
        });
        if (!group) {
            return res.status(404).json({ message: 'Comunidade não encontrada.' });
        }
        res.json(group);
    } catch (error) {
        console.error('Erro ao obter detalhes da comunidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter detalhes da comunidade.' });
    }
};

exports.getGroupPosts = async (req, res) => { 
  try {
    const groupId = req.params.groupId;
    const userId = req.user ? req.user.id : null;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Comunidade não encontrada.' });
    }

    const posts = await Post.findAll({
      where: { communityId: groupId }, 
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }],
      order: [['createdAt', 'DESC']],
    });

    const postsWithInteractions = await Promise.all(posts.map(async (post) => {
        const postData = post.toJSON();

        const likes = await Interaction.count({ where: { postId: postData.id, type: 'like', targetCommentId: null } });
        const dislikes = await Interaction.count({ where: { postId: postData.id, type: 'dislike', targetCommentId: null } });
        const commentsCount = await Interaction.count({ where: { postId: postData.id, type: 'comment' } });

        let userInteractionType = null;
        if (userId) {
            const userInteraction = await Interaction.findOne({
                where: { postId: postData.id, userId: userId, type: { [Sequelize.Op.in]: ['like', 'dislike'] }, targetCommentId: null }
            });
            if (userInteraction) {
                userInteractionType = userInteraction.type;
            }
        }
        
        return {
            ...postData,
            likes: likes,
            dislikes: dislikes,
            comments: commentsCount,
            userHasInteracted: userInteractionType
        };
    }));

    res.json(postsWithInteractions);
  } catch (error) {
    console.error('Erro ao obter postagens da comunidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter postagens da comunidade.' });
  }
};
