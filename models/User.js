const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('superadmin', 'admin', 'user'), allowNull: false, defaultValue: 'user' },
  token: DataTypes.STRING,
  token_expiration: DataTypes.DATE,
  reset_token: DataTypes.STRING,
  reset_token_expiration: DataTypes.DATE,
  login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  locked_until: DataTypes.DATE,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: true, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' });
