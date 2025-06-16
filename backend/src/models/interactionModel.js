const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Post = require('./postModel');

const Interaction = sequelize.define('Interaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike', 'comment'), 
    allowNull: false,
  },
  commentContent: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
  },
  targetCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'Interactions',
      key: 'id',
    }
  }
}, {
  timestamps: true, 
  updatedAt: false,
});


Interaction.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Interaction, { foreignKey: 'userId' });

Interaction.belongsTo(Post, { foreignKey: 'postId', allowNull: false }); 
Post.hasMany(Interaction, { foreignKey: 'postId' });

Interaction.belongsTo(Interaction, { as: 'ParentComment', foreignKey: 'parentId', allowNull: true });
Interaction.hasMany(Interaction, { as: 'Replies', foreignKey: 'parentId' });

Interaction.belongsTo(Interaction, { as: 'TargetedComment', foreignKey: 'targetCommentId', allowNull: true });


module.exports = Interaction;
