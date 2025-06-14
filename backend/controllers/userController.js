// backend/controllers/userController.js
const User = require('../models/User');
const Tag = require('../models/Tag');
const UserTag = require('../models/UserTag');
const Connection = require('../models/Connection');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'birthdate', 'profilePicture'],
      include: [{ model: Tag }]
    });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
};

const updateUserTags = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const { tags } = req.body;
    if (tags.length > 5) return res.status(400).json({ message: 'Máximo de 5 tags permitido' });

    const tagInstances = await Promise.all(tags.map(async name => {
      return await Tag.findOrCreate({ where: { name } }).then(([tag]) => tag);
    }));

    await user.setTags(tagInstances);
    res.json({ message: 'Tags atualizadas com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar tags', error: err.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const connection = await Connection.create({
      requesterId: req.userId,
      receiverId,
      status: 'pending'
    });
    res.status(201).json(connection);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar solicitação de conexão', error: err.message });
  }
};

const acceptConnection = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const connection = await Connection.findOne({
      where: { requesterId, receiverId: req.userId, status: 'pending' }
    });

    if (!connection) return res.status(404).json({ message: 'Solicitação não encontrada' });

    connection.status = 'accepted';
    await connection.save();
    res.json({ message: 'Conexão aceita com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao aceitar conexão', error: err.message });
  }
};

const searchUsersByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    const users = await User.findAll({
      include: {
        model: Tag,
        where: { name: tag },
        through: { attributes: [] }
      },
      attributes: ['id', 'username', 'email', 'profilePicture']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro na busca por tag', error: err.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserTags,
  sendConnectionRequest,
  acceptConnection,
  searchUsersByTag
};