const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PasanganHidup', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, umur: DataTypes.INTEGER,
  jenis_kelamin: DataTypes.STRING, alamat: DataTypes.STRING, kriteria_pasangan: DataTypes.STRING,
  hobi: DataTypes.STRING, pendidikan_terakhir: DataTypes.STRING, status_hubungan: DataTypes.STRING,
  skor_kecocokan: DataTypes.INTEGER, rekomendasi: DataTypes.STRING,
}, { tableName: 'pasangan_hidup' });
