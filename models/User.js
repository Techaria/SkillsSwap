const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const { Sequelize, DataTypes } = require('sequelize');  // Ensure you import both Sequelize and DataTypes
const sequelize = require('../config/database');  // Import the sequelize instance from your config

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokens: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Hash password before saving it to the database
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Associations
User.associate = (models) => {
  User.hasMany(models.Skill);
  User.hasMany(models.Transaction);
};

module.exports = User;  // Export the model
