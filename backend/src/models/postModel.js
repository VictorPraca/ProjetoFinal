const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); // Importar o modelo de Usuário

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.ENUM('text', 'image', 'video'),
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING, // URL da imagem/vídeo se contentType for 'image' ou 'video'
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Post.belongsTo(User, { foreignKey: 'userId', allowNull: false }); // Uma postagem pertence a um usuário
User.hasMany(Post, { foreignKey: 'userId' }); // Um usuário pode ter muitas postagens

module.exports = Post;