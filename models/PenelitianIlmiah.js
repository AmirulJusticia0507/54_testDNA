const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PenelitianIlmiah', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  input_penelitian_ilmiah: DataTypes.TEXT, hasil_penelitian: DataTypes.TEXT, korelasi: DataTypes.FLOAT,
  judul: DataTypes.STRING, penulis: DataTypes.STRING, tahun_terbit: DataTypes.INTEGER, penerbit: DataTypes.STRING, url: DataTypes.STRING,
}, { tableName: 'penelitian_ilmiah' });
