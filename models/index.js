const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')
const Skill = require('./Skill')(sequelize, Sequelize.DataTypes);
const Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Skill, { foreignKey: 'userId' });
Skill.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Skill,
  Transaction
};
