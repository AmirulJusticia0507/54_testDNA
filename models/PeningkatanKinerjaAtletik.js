const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('PeningkatanKinerjaAtletik', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  nilai_awal: DataTypes.FLOAT, nilai_akhir: DataTypes.FLOAT, peningkatan_kinerja: DataTypes.STRING,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: false, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'peningkatan_kinerja_atletik' });
