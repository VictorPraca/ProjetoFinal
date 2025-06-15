const Tag = require('../models/tagModel');
const User = require('../models/userModel');
const { Op } = require('sequelize');

exports.addTagsToUser = async (req, res) => {
  try {
    const { tags } = req.body; // Array de nomes de tags
    const userId = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (tags.length > 5) {
      return res.status(400).json({ message: 'You can add a maximum of 5 tags to your profile.' });
    }

    // Criar ou encontrar as tags
    const tagInstances = await Promise.all(tags.map(tagName =>
      Tag.findOrCreate({ where: { name: tagName.toLowerCase() } })
    ));

    // Adicionar as tags ao usuário
    await user.setTags(tagInstances.map(([tag, created]) => tag)); // 'setTags' substitui as tags existentes

    res.status(200).json({ message: 'Tags updated successfully.', tags: tagInstances.map(([tag]) => tag.name) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchUsersByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Tags como query params, ex: ?tags=esporte,musica
    if (!tags) {
      return res.status(400).json({ message: 'Please provide tags for search.' });
    }

    const tagNames = tags.split(',').map(tag => tag.trim().toLowerCase());

    const users = await User.findAll({
      include: [{
        model: Tag,
        where: { name: { [Op.in]: tagNames } },
        through: { attributes: [] } // Não retornar a tabela de associação
      }],
      attributes: ['id', 'username', 'profilePicture', 'email'],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({ attributes: ['id', 'name'] });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};