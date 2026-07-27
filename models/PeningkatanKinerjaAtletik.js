const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PeningkatanKinerjaAtletik', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  nilai_awal: DataTypes.FLOAT, nilai_akhir: DataTypes.FLOAT, peningkatan_kinerja: DataTypes.STRING,
}, { tableName: 'peningkatan_kinerja_atletik' });
