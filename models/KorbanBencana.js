const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('KorbanBencana', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, umur: DataTypes.INTEGER,
  jenis_kelamin: DataTypes.STRING, alamat: DataTypes.STRING, jenis_bencana: DataTypes.STRING,
  kondisi_kesehatan: DataTypes.STRING, keterangan: DataTypes.TEXT,
  skor_prioritas: DataTypes.INTEGER, kategori_prioritas: DataTypes.STRING,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: false, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'korban_bencana' });
