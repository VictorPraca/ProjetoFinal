const Tag = require('../models/tagModel');
const User = require('../models/userModel');
const { Op } = require('sequelize'); // Importa o operador Op do Sequelize

// Controlador para adicionar/atualizar tags de um usuário
exports.addTagsToUser = async (req, res) => {
  try {
    const { tags } = req.body; // Array de nomes de tags (ex: ["tecnologia", "jogos"])
    const userId = req.user.id; // ID do usuário logado (definido pelo middleware 'protect')

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

    // Encontra ou cria as tags no banco de dados
    // Garante que as tags são salvas em minúsculas para consistência
    const tagInstances = await Promise.all(tags.map(tagName =>
      Tag.findOrCreate({ 
          where: { name: tagName.toLowerCase() },
          defaults: { name: tagName.toLowerCase() } // Garante que o nome é minúsculo ao criar
      })
    ));

    // Adiciona (ou substitui) as tags ao usuário. 'setTags' do Sequelize substitui as existentes.
    await user.setTags(tagInstances.map(([tag]) => tag)); // Pega apenas as instâncias de Tag (o primeiro elemento do array retornado por findOrCreate)

    res.status(200).json({ message: 'Tags do perfil atualizadas com sucesso.', tags: tagInstances.map(([tag]) => tag.name) });
  } catch (error) {
    console.error('Erro ao adicionar tags ao usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao adicionar tags.' });
  }
};

// Controlador para buscar usuários por tags similares (se precisar no futuro)
exports.searchUsersByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Tags como query params (ex: ?tags=esporte,musica)
    if (!tags) {
      return res.status(400).json({ message: 'Por favor, forneça tags para a busca.' });
    }

    const tagNames = tags.split(',').map(tag => tag.trim().toLowerCase());

    // Busca usuários que têm ALGUMA das tags fornecidas
    const users = await User.findAll({
      include: [{
        model: Tag,
        where: { name: { [Op.in]: tagNames } }, // Onde o nome da tag está na lista de tags buscadas
        through: { attributes: [] } // Não retornar a tabela de associação UserTag
      }],
      attributes: ['id', 'username', 'profilePicture', 'email'], // Atributos do usuário a serem retornados
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários por tags:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar usuários por tags.' });
  }
};

// Controlador para obter todas as tags existentes no sistema
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({ attributes: ['id', 'name'] });
        res.json(tags);
    } catch (error) {
        console.error('Erro ao obter todas as tags:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter todas as tags.' });
    }
};

// Controlador para obter as tags de um usuário específico (por username)
exports.getUserTagsByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ 
            where: { username },
            include: [{ model: Tag, through: { attributes: [] } }], // Inclui as tags do usuário
            attributes: ['id', 'username'] // Apenas atributos básicos do usuário
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(user.Tags); // Retorna apenas as tags associadas ao usuário
    } catch (error) {
        console.error('Erro ao obter tags do usuário por username:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao obter tags do usuário.' });
    }
};
