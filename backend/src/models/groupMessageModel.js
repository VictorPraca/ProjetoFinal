const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const { Group } = require('./groupModel');

const GroupMessage = sequelize.define('GroupMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

GroupMessage.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(GroupMessage, { foreignKey: 'userId' });

GroupMessage.belongsTo(Group, { foreignKey: 'groupId', allowNull: false });
Group.hasMany(GroupMessage, { foreignKey: 'groupId' });

module.exports = GroupMessage;