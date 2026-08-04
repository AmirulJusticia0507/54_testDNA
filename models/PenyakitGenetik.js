const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PenyakitGenetik', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  riwayat_penyakit: DataTypes.TEXT, jenis_penyakit: DataTypes.STRING,
  input_identifikasi_penyakit_genetik: DataTypes.TEXT, kemungkinan_kelainan_genetik: DataTypes.FLOAT,
  hasil_skrining: DataTypes.TEXT,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: false, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'penyakit_genetik' });
