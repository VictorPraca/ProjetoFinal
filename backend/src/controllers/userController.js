const User = require('../models/userModel');
const { Sequelize } = require('sequelize');
const Post = require('../models/postModel');
const Interaction = require('../models/interactionModel'); 

exports.getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil do usuário por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter perfil do usuário.' });
  }
};

exports.getUserProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username; 
    const user = await User.findOne({ where: { username }, attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil do usuário por username:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter perfil do usuário.' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const posts = await Post.findAll({
      where: { userId: user.id }, 
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }], 
      order: [['createdAt', 'DESC']],
    });

    const currentUserId = req.user ? req.user.id : null; 

    const postsWithInteractions = await Promise.all(posts.map(async (post) => {
        const postData = post.toJSON();

        const likes = await Interaction.count({ where: { postId: postData.id, type: 'like', targetCommentId: null } });
        const dislikes = await Interaction.count({ where: { postId: postData.id, type: 'dislike', targetCommentId: null } });
        const commentsCount = await Interaction.count({ where: { postId: postData.id, type: 'comment' } });

        let userInteractionType = null;
        if (currentUserId) {
            const userInteraction = await Interaction.findOne({
                where: { postId: postData.id, userId: currentUserId, type: { [Sequelize.Op.in]: ['like', 'dislike'] }, targetCommentId: null }
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
    console.error('Erro ao obter postagens do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter postagens do usuário.' });
  }
};


exports.sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id; 

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Não é possível enviar solicitação de conexão para si mesmo.' });
        }

        const sender = await User.findByPk(senderId);
        const receiver = await User.findByPk(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Remetente ou destinatário não encontrado.' });
        }

        const isAlreadyConnected = await sender.hasConnection(receiver) || await receiver.hasConnection(sender);
        if (isAlreadyConnected) {
            return res.status(400).json({ message: 'Já conectado ou solicitação de conexão pendente.' });
        }

        await sender.addConnection(receiver);
        res.status(200).json({ message: 'Solicitação de conexão enviada.' });

    } catch (error) {
        console.error('Erro ao enviar solicitação de conexão:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao enviar solicitação de conexão.' });
    }
};

exports.acceptConnectionRequest = async (req, res) => {
    try {
        const { senderId } = req.body;
        const receiverId = req.user.id; 

        const sender = await User.findByPk(senderId);
        const receiver = await User.findByPk(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Remetente ou destinatário não encontrado.' });
        }

        const hasPendingRequest = await receiver.hasConnection(sender);

        if (!hasPendingRequest) {
            return res.status(400).json({ message: 'Nenhuma solicitação de conexão pendente deste usuário.' });
        }

        await sender.addConnection(receiver);
        res.status(200).json({ message: 'Conexão aceita.' });

    } catch (error) {
        console.error('Erro ao aceitar solicitação de conexão:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao aceitar solicitação de conexão.' });
    }
};
