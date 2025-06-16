const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const PrivateMessage = sequelize.define('PrivateMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('sent', 'received', 'read'),
    defaultValue: 'sent',
  },
});

PrivateMessage.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
PrivateMessage.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

module.exports = PrivateMessage;