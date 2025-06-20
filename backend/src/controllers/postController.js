
const Post = require('../models/postModel');
const Interaction = require('../models/interactionModel');
const User = require('../models/userModel');
const { Sequelize } = require('sequelize'); 


exports.createPost = async (req, res) => {
  try {
    const { content, contentType, communityId } = req.body; 
    const userId = req.user.id;
    let mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content && !mediaUrl) {
      return res.status(400).json({ message: 'A postagem não pode ser vazia. Forneça texto ou mídia.' });
    }
    if ((contentType === 'image' || contentType === 'video') && !mediaUrl) {
        return res.status(400).json({ message: `Para o tipo ${contentType}, é necessário um arquivo de mídia.` });
    }

    if (communityId) {
        const community = await require('../models/groupModel').Group.findByPk(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Comunidade especificada não encontrada.' });
        }
    }

    const newPost = await Post.create({ userId, content, contentType, mediaUrl, communityId: communityId || null }); 

    const populatedPost = await Post.findByPk(newPost.id, {
        include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }]
    });

    res.status(201).json({ message: 'Postagem criada com sucesso', post: populatedPost });
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar postagem.', details: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }], 
      order: [['createdAt', 'DESC']], 
    });

    const currentUserId = req.user ? req.user.id : null; 

    const postsWithInteractions = await Promise.all(posts.map(async (post) => {
        const postData = post.toJSON(); 

        const likes = await Interaction.count({ where: { postId: postData.id, type: 'like' } });
        const dislikes = await Interaction.count({ where: { postId: postData.id, type: 'dislike' } });
        const commentsCount = await Interaction.count({ where: { postId: postData.id, type: 'comment' } });

        let userInteractionType = null;
        if (currentUserId) {
            const userInteraction = await Interaction.findOne({
                where: { postId: postData.id, userId: currentUserId, type: { [Sequelize.Op.in]: ['like', 'dislike'] } }
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
    console.error('Erro ao obter postagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter postagens.' });
  }
};

exports.toggleLikeDislike = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
        console.error('Erro de autenticação: req.user ou req.user.id indefinido.');
        return res.status(401).json({ message: 'Você precisa estar logado para realizar esta ação.' });
    }
    const userId = req.user.id; 

    console.log('ToggleLikeDislike: userId:', userId); 

    const { postId, commentId, type } = req.body; 

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de interação inválido. Use "like" ou "dislike".' });
    }

    let targetEntity;
    let associatedPostId = null;

    if (postId && !commentId) {
      targetEntity = await Post.findByPk(postId);
      if (!targetEntity) {
          return res.status(404).json({ message: 'Postagem não encontrada.' });
      }
      associatedPostId = postId;
    } else if (commentId && !postId) {
      targetEntity = await Interaction.findByPk(commentId);
      if (!targetEntity || targetEntity.type !== 'comment') {
          return res.status(404).json({ message: 'Comentário alvo não encontrado ou não é um comentário válido.' });
      }
      associatedPostId = targetEntity.postId;
    } else {
      return res.status(400).json({ message: 'Forneça exatamente um entre postId ou commentId.' });
    }

    if (!targetEntity) { 
      return res.status(404).json({ message: 'Entidade alvo (Post ou Comentário) não encontrada.' });
    }

    const whereCondition = {
      userId,
      type: { [Sequelize.Op.in]: ['like', 'dislike'] },
      postId: associatedPostId,
      targetCommentId: commentId || null
    };

    const existingInteraction = await Interaction.findOne({ where: whereCondition });

    let action = '';
    let newUserInteractionType = null;

    if (existingInteraction) {
      if (existingInteraction.type === type) {
        await existingInteraction.destroy();
        action = `${type} removido`;
        newUserInteractionType = null;
      } else {
        existingInteraction.type = type;
        await existingInteraction.save();
        action = `interação alterada para ${type}`;
        newUserInteractionType = type;
      }
    } else {
      const newInteractionData = {
        userId,
        type,
        postId: associatedPostId,
        targetCommentId: commentId || null
      };
      await Interaction.create(newInteractionData);
      action = `${type} adicionado`;
      newUserInteractionType = type;
    }

    let returnCounts = {};
    if (postId && !commentId) {
        returnCounts.likes = await Interaction.count({ where: { postId: associatedPostId, type: 'like', targetCommentId: null } });
        returnCounts.dislikes = await Interaction.count({ where: { postId: associatedPostId, type: 'dislike', targetCommentId: null } });
    } else if (commentId && !postId) {
        returnCounts.likes = await Interaction.count({ where: { targetCommentId: commentId, type: 'like' } });
        returnCounts.dislikes = await Interaction.count({ where: { targetCommentId: commentId, type: 'dislike' } });
    }
    
    res.status(200).json({ 
        message: `${action} com sucesso.`, 
        ...returnCounts, 
        userInteractionType: newUserInteractionType 
    });

  } catch (error) {
    console.error('Erro ao alternar like/dislike:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao processar like/dislike.' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Conteúdo do comentário não pode ser vazio.' });
    }

    if (!postId && !parentId) {
        return res.status(400).json({ message: 'Comentário deve ser associado a um postId ou parentId.' });
    }
    if (postId) {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Postagem não encontrada.' });
        }
    }
    if (parentId) {
      const parentComment = await Interaction.findByPk(parentId);
      if (!parentComment || parentComment.type !== 'comment') {
        return res.status(404).json({ message: 'Comentário pai não encontrado ou não é um comentário válido.' });
      }
    }

    const newComment = await Interaction.create({
      userId,
      postId: postId || null, 
      type: 'comment',
      commentContent: content.trim(),
      parentId: parentId || null, 
    });

    const populatedComment = await Interaction.findByPk(newComment.id, {
        include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }]
    });

    res.status(201).json({ message: 'Comentário adicionado com sucesso.', comment: populatedComment });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao adicionar comentário.' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const currentUserId = req.user ? req.user.id : null;

    const populateCommentInteractions = async (commentId) => {
        const comment = await Interaction.findByPk(commentId, {
            include: [
                { model: User, attributes: ['id', 'username', 'profilePicture'] }
            ]
        });
        if (!comment) return null;

        const commentData = comment.toJSON();

        commentData.likes = await Interaction.count({ where: { targetCommentId: commentData.id, type: 'like' } });
        commentData.dislikes = await Interaction.count({ where: { targetCommentId: commentData.id, type: 'dislike' } });

        let userInteractionType = null;
        if (currentUserId) {
            const userInteraction = await Interaction.findOne({
                where: { targetCommentId: commentData.id, userId: currentUserId, type: { [Sequelize.Op.in]: ['like', 'dislike'] } }
            });
            if (userInteraction) {
                userInteractionType = userInteraction.type;
            }
        }
        commentData.userHasInteracted = userInteractionType;

        const replies = await Interaction.findAll({
            where: { parentId: commentData.id, type: 'comment' },
            order: [['createdAt', 'ASC']]
        });

        commentData.Replies = await Promise.all(replies.map(reply => populateCommentInteractions(reply.id)));

        return commentData;
    };

    const topLevelComments = await Interaction.findAll({
      where: { postId, type: 'comment', parentId: null },
      order: [['createdAt', 'ASC']],
    });
s
    const commentsWithFullInteractions = await Promise.all(
    topLevelComments.map(async comment => { 
        return await populateCommentInteractions(comment.id);
    }));

    res.json(commentsWithFullInteractions);
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter comentários.' });
  }
};

exports.getPostInteractionsSummary = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) {
        return res.status(404).json({ message: 'Postagem não encontrada.' });
    }

    const likes = await Interaction.count({ where: { postId, type: 'like' } });
    const dislikes = await Interaction.count({ where: { postId, type: 'dislike' } });
    const commentsCount = await Interaction.count({ where: { postId, type: 'comment' } });

    res.json({ likes, dislikes, commentsCount });
  } catch (error) {
    console.error('Erro ao obter resumo de interações:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter resumo de interações.' });
  }
};
