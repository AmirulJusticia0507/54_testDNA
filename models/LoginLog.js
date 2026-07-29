const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('LoginLog', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  ip_address: DataTypes.STRING,
  user_agent: DataTypes.TEXT,
  logged_in_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'login_logs', timestamps: false });
