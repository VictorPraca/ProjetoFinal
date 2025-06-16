const Tag = require('../models/tagModel');
const User = require('../models/userModel');
const { Op } = require('sequelize'); 

exports.addTagsToUser = async (req, res) => {
  try {
    const { tags } = req.body; 
    const userId = req.user.id; 

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (!Array.isArray(tags)) {
        return res.status(400).json({ message: 'As tags devem ser fornecidas como um array.' });
    }

    if (tags.length > 5) {
      return res.status(400).json({ message: 'Você pode adicionar um máximo de 5 tags ao seu perfil.' });
    }

    const tagInstances = await Promise.all(tags.map(tagName =>
      Tag.findOrCreate({ 
          where: { name: tagName.toLowerCase() },
          defaults: { name: tagName.toLowerCase() }
      })
    ));

    await user.setTags(tagInstances.map(([tag]) => tag)); 

    res.status(200).json({ message: 'Tags do perfil atualizadas com sucesso.', tags: tagInstances.map(([tag]) => tag.name) });
  } catch (error) {
    console.error('Erro ao adicionar tags ao usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao adicionar tags.' });
  }
};

exports.searchUsersByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ message: 'Por favor, forneça tags para a busca.' });
    }

    const tagNames = tags.split(',').map(tag => tag.trim().toLowerCase());

    const users = await User.findAll({
      include: [{
        model: Tag,
        where: { name: { [Op.in]: tagNames } }, 
        through: { attributes: [] } 
      }],
      attributes: ['id', 'username', 'profilePicture', 'email'], 
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários por tags:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar usuários por tags.' });
  }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({ attributes: ['id', 'name'] });
        res.json(tags);
    } catch (error) {
        console.error('Erro ao obter todas as tags:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter todas as tags.' });
    }
};

exports.getUserTagsByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ 
            where: { username },
            include: [{ model: Tag, through: { attributes: [] } }], 
            attributes: ['id', 'username'] 
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(user.Tags); 
    } catch (error) {
        console.error('Erro ao obter tags do usuário por username:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter tags do usuário.' });
    }
};
