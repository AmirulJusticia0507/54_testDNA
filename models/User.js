const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false }, token: DataTypes.STRING, token_expiration: DataTypes.DATE,
}, { tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' });
