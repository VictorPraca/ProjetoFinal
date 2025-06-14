// backend/models/Connection.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Connection = sequelize.define('Connection', {
  status: {
    type: DataTypes.ENUM('pending', 'accepted'),
    defaultValue: 'pending'
  }
});

User.belongsToMany(User, {
  through: Connection,
  as: 'Connections',
  foreignKey: 'requesterId',
  otherKey: 'receiverId'
});

module.exports = Connection;