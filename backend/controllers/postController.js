const Post = require('../models/Post');
const Comment = require('../models/Comment');
const PostReaction = require('../models/PostReaction');

module.exports = {
  createPost: async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user.id; // assumindo user autenticado no req.user

      const post = await Post.create({ userId, content });
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar post.' });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        include: [
          { model: Comment, as: 'comments' },
          { model: PostReaction, as: 'reactions' }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar posts.' });
    }
  },

  // Outros métodos (getPostById, updatePost, deletePost) podem ser adicionados
};