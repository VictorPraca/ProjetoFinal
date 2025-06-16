const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); 

const Tag = sequelize.define('Tag', {
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
}, {
  timestamps: false,
});

const UserTag = sequelize.define('UserTag', {}, { timestamps: false });

User.belongsToMany(Tag, { through: UserTag, foreignKey: 'userId' });
Tag.belongsToMany(User, { through: UserTag, foreignKey: 'tagId' });

module.exports = Tag;
