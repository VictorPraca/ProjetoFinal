// backend/src/controllers/postController.js
const Post = require('../models/postModel');
const Interaction = require('../models/interactionModel');
const User = require('../models/userModel');
const { Sequelize } = require('sequelize'); // Importar Sequelize para funções de agregação

// Função para criar uma nova postagem
exports.createPost = async (req, res) => {
  try {
    const { content, contentType } = req.body;
    const userId = req.user.id; // ID do usuário logado (definido pelo middleware 'protect')
    let mediaUrl = req.file ? `/uploads/${req.file.filename}` : null; // Se houver upload de arquivo, pega o caminho

    if (!content && !mediaUrl) {
      return res.status(400).json({ message: 'A postagem não pode ser vazia. Forneça texto ou mídia.' });
    }
    if ((contentType === 'image' || contentType === 'video') && !mediaUrl) {
        return res.status(400).json({ message: `Para o tipo ${contentType}, é necessário um arquivo de mídia.` });
    }

    const newPost = await Post.create({ userId, content, contentType, mediaUrl });

    // Opcional: Retornar a postagem com os dados do usuário para o frontend
    const populatedPost = await Post.findByPk(newPost.id, {
        include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }]
    });

    res.status(201).json({ message: 'Postagem criada com sucesso', post: populatedPost });
  } catch (error) {
    console.error('Erro ao criar postagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao criar postagem.', details: error.message });
  }
};

// Função para obter todas as postagens (para o feed)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      // Garante que o username e profilePicture do usuário da postagem sejam incluídos
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }], 
      order: [['createdAt', 'DESC']], // Ordena as postagens da mais recente para a mais antiga
    });

    const currentUserId = req.user ? req.user.id : null; // O ID do usuário logado, definido pelo middleware 'protect'

    const postsWithInteractions = await Promise.all(posts.map(async (post) => {
        // Converte para JSON para poder adicionar propriedades
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
            ...postData, // Usa a versão JSON
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


// Função para adicionar ou remover likes/dislikes
exports.toggleLikeDislike = async (req, res) => {
  try {
    const { postId, commentId, type } = req.body; // Recebe postId OU commentId
    const userId = req.user.id; // ID do usuário logado

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Tipo de interação inválido. Use "like" ou "dislike".' });
    }

    let targetEntity; // Referência à entidade alvo (Post ou Comentário)
    let associatedPostId = null; // O ID do Post principal ao qual a interação pertence

    // PASSO 1: Identificar o alvo da interação e determinar o associatedPostId
    if (postId && !commentId) {
      // Interação é em uma POSTAGEM
      targetEntity = await Post.findByPk(postId);
      if (!targetEntity) {
          return res.status(404).json({ message: 'Postagem não encontrada.' });
      }
      associatedPostId = postId; // O post ID é o alvo
    } else if (commentId && !postId) {
      // Interação é em um COMENTÁRIO
      targetEntity = await Interaction.findByPk(commentId); // Busca o comentário
      if (!targetEntity || targetEntity.type !== 'comment') { // Garante que é um comentário
          return res.status(404).json({ message: 'Comentário alvo não encontrado ou não é um comentário válido.' });
      }
      associatedPostId = targetEntity.postId; // O postId associado é o postId do comentário
    } else {
      // Se nem postId nem commentId foram fornecidos, ou ambos foram fornecidos
      return res.status(400).json({ message: 'Forneça exatamente um entre postId ou commentId.' });
    }

    // Se a entidade alvo não foi encontrada (Post ou Comentário), retorna erro
    if (!targetEntity) { 
      return res.status(404).json({ message: 'Entidade alvo (Post ou Comentário) não encontrada.' });
    }

    // PASSO 2: Definir a condição de busca para uma interação existente do usuário
    const whereCondition = {
      userId,
      type: { [Sequelize.Op.in]: ['like', 'dislike'] },
      postId: associatedPostId, // Sempre usa o PostId associado (do Post ou do Comentário)
      targetCommentId: commentId || null // Será o ID do comentário se for like/dislike de comentário, ou null se for de post
    };

    const existingInteraction = await Interaction.findOne({ where: whereCondition });

    let action = '';
    let newUserInteractionType = null;

    // PASSO 3: Processar a interação (criar, remover ou alterar)
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
        postId: associatedPostId, // Define o postId aqui também para novas interações
        targetCommentId: commentId || null
      };
      await Interaction.create(newInteractionData);
      action = `${type} adicionado`;
      newUserInteractionType = type;
    }

    // PASSO 4: Calcular os novos contadores de likes/dislikes para a ENTIDADE ALVO
    let returnCounts = {};
    if (postId && !commentId) { // Se a interação foi em um Post
        returnCounts.likes = await Interaction.count({ where: { postId: associatedPostId, type: 'like', targetCommentId: null } });
        returnCounts.dislikes = await Interaction.count({ where: { postId: associatedPostId, type: 'dislike', targetCommentId: null } });
    } else if (commentId && !postId) { // Se a interação foi em um Comentário
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

// Função para adicionar um comentário ou resposta a um comentário
exports.addComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Conteúdo do comentário não pode ser vazio.' });
    }

    if (!postId && !parentId) { // Comentário deve ter um post ou um pai
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
      postId: postId || null, // ID do post principal
      type: 'comment',
      commentContent: content.trim(),
      parentId: parentId || null, // ID do comentário pai se for resposta
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

// Função para obter todos os comentários de uma postagem (incluindo respostas e seus likes/dislikes)
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const currentUserId = req.user ? req.user.id : null; // ID do usuário logado

    // Função recursiva para buscar comentários, respostas e suas interações
    const populateCommentInteractions = async (commentId) => {
        const comment = await Interaction.findByPk(commentId, {
            include: [
                { model: User, attributes: ['id', 'username', 'profilePicture'] }
            ]
        });
        if (!comment) return null;

        const commentData = comment.toJSON();

        // Contar likes/dislikes para ESTE comentário
        // CORRIGIDO: Usando 'targetCommentId' (o nome correto da coluna no modelo)
        commentData.likes = await Interaction.count({ where: { targetCommentId: commentData.id, type: 'like' } });
        commentData.dislikes = await Interaction.count({ where: { targetCommentId: commentData.id, type: 'dislike' } });
        
        // Verificar interação do usuário logado com ESTE comentário
        let userInteractionType = null;
        if (currentUserId) {
            const userInteraction = await Interaction.findOne({
                // CORRIGIDO: Usando 'targetCommentId'
                where: { targetCommentId: commentData.id, userId: currentUserId, type: { [Sequelize.Op.in]: ['like', 'dislike'] } }
            });
            if (userInteraction) {
                userInteractionType = userInteraction.type;
            }
        }
        commentData.userHasInteracted = userInteractionType;

        // Buscar e popular respostas recursivamente
        const replies = await Interaction.findAll({
            where: { parentId: commentData.id, type: 'comment' },
            order: [['createdAt', 'ASC']]
        });
        // Mapeia e chama a função recursivamente para cada resposta
        commentData.Replies = await Promise.all(replies.map(reply => populateCommentInteractions(reply.id)));

        return commentData;
    };

    // Busca apenas comentários de nível superior para esta postagem
    const topLevelComments = await Interaction.findAll({
      where: { postId, type: 'comment', parentId: null },
      order: [['createdAt', 'ASC']],
    });

    // Popula cada comentário principal com suas respostas aninhadas e interações
    const commentsWithFullInteractions = await Promise.all(
    topLevelComments.map(async comment => { // <-- MUDEI AQUI PARA async
        return await populateCommentInteractions(comment.id); // <-- Await aqui
    }));

    res.json(commentsWithFullInteractions);
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao obter comentários.' });
  }
};

// Função para obter o resumo de interações de uma postagem específica (likes, dislikes, comentários)
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
