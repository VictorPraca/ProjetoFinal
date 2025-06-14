// backend/models/UserTag.js
const { sequelize } = require('../config/db');
const User = require('./User');
const Tag = require('./Tag');

const UserTag = sequelize.define('UserTag', {}, { timestamps: false });

User.belongsToMany(Tag, { through: UserTag });
Tag.belongsToMany(User, { through: UserTag });

module.exports = UserTag;