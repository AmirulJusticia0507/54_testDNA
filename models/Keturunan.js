const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('Keturunan', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  nama_ayah: DataTypes.STRING, nama_ibu: DataTypes.STRING, nama_pasangan: DataTypes.STRING, jumlah_anak: DataTypes.INTEGER,
  input_keturunan: DataTypes.STRING, kemungkinan_gen: DataTypes.FLOAT, jenis_inheritance: DataTypes.STRING,
}, { tableName: 'keturunan' });
