const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); // Importa o modelo de Usuário

// Definição do modelo Tag
const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Nome da tag deve ser único
  },
}, {
  timestamps: false, // Tags geralmente não precisam de timestamps
});

// Tabela de associação para tags de usuário (muitos para muitos)
const UserTag = sequelize.define('UserTag', {}, { timestamps: false });

// Relação: Um usuário pode ter muitas tags e uma tag pode estar em muitos usuários
User.belongsToMany(Tag, { through: UserTag, foreignKey: 'userId' });
Tag.belongsToMany(User, { through: UserTag, foreignKey: 'tagId' });

module.exports = Tag;
