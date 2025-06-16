const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const { Group } = require('./groupModel'); // Importar o modelo Group

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contentType: {
    type: DataTypes.ENUM('text', 'image', 'video'),
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  communityId: { // <-- ESSA COLUNA!
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: Group, 
      key: 'id',
    }
  }
}, {
  timestamps: true,
  updatedAt: false,
});

Post.belongsTo(User, { foreignKey: 'userId', allowNull: false }); 
User.hasMany(Post, { foreignKey: 'userId' }); 

Post.belongsTo(Group, { foreignKey: 'communityId', allowNull: true }); // <-- E ESSA RELAÇÃO!
Group.hasMany(Post, { foreignKey: 'communityId' });

module.exports = Post;
