const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Tabela de associação para membros do grupo
const GroupMember = sequelize.define('GroupMember', {
  role: {
    type: DataTypes.ENUM('member', 'administrator'),
    defaultValue: 'member',
  },
});

User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });

// Adicionar um campo para o criador do grupo, se necessário
Group.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });

module.exports = { Group, GroupMember };