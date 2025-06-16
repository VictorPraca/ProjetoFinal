const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Post = require('./postModel');

// Definição do modelo Interaction (para likes, dislikes, comentários)
const Interaction = sequelize.define('Interaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike', 'comment'), // Tipo de interação
    allowNull: false,
  },
  commentContent: {
    type: DataTypes.TEXT,
    allowNull: true, // Conteúdo apenas para interações do tipo 'comment'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Data e hora de criação automática
  },
  // NOVO: ID do comentário que esta interação (like/dislike) está diretamente direcionada
  targetCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Pode ser nulo se for um like/dislike em um Post
    references: {
      model: 'Interactions', // Referencia a própria tabela Interaction (para comments)
      key: 'id',
    }
  }
}, {
  timestamps: true, // Adiciona updatedAt automaticamente
  updatedAt: false, // Desabilita o campo updatedAt se não for necessário
});

// Relações:
// Uma interação pertence a um usuário
Interaction.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Interaction, { foreignKey: 'userId' });

// Uma interação pode ser em uma postagem (para likes/dislikes em posts)
// postId é obrigatório, mesmo para likes/dislikes em comentários, pois comentários pertencem a posts.
Interaction.belongsTo(Post, { foreignKey: 'postId', allowNull: false }); 
Post.hasMany(Interaction, { foreignKey: 'postId' });

// Uma interação (comentário) pode ser uma resposta a outro comentário (self-referencing)
Interaction.belongsTo(Interaction, { as: 'ParentComment', foreignKey: 'parentId', allowNull: true });
Interaction.hasMany(Interaction, { as: 'Replies', foreignKey: 'parentId' });

// Relação para o NOVO targetCommentId: Uma interação pode ter como alvo um comentário
Interaction.belongsTo(Interaction, { as: 'TargetedComment', foreignKey: 'targetCommentId', allowNull: true });
// Isso permite que você faça um `include` para o comentário que foi curtido/descurtido.

module.exports = Interaction;
