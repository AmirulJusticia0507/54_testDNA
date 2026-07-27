const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('KorbanBencana', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, umur: DataTypes.INTEGER,
  jenis_kelamin: DataTypes.STRING, alamat: DataTypes.STRING, jenis_bencana: DataTypes.STRING,
  kondisi_kesehatan: DataTypes.STRING, keterangan: DataTypes.TEXT,
  skor_prioritas: DataTypes.INTEGER, kategori_prioritas: DataTypes.STRING,
}, { tableName: 'korban_bencana' });
