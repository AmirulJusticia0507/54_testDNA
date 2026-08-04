const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PasanganHidup', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, umur: DataTypes.INTEGER,
  jenis_kelamin: DataTypes.STRING, alamat: DataTypes.STRING, kriteria_pasangan: DataTypes.STRING,
  hobi: DataTypes.STRING, pendidikan_terakhir: DataTypes.STRING, status_hubungan: DataTypes.STRING,
  skor_kecocokan: DataTypes.INTEGER, rekomendasi: DataTypes.STRING,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: false, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'pasangan_hidup' });
