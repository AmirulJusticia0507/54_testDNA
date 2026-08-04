const { DataTypes } = require('sequelize');
const sequelize = require('../db');
module.exports = sequelize.define('Keturunan', {
  nama: { type: DataTypes.STRING, allowNull: false }, usia: DataTypes.INTEGER, jenis_kelamin: DataTypes.STRING,
  nama_ayah: DataTypes.STRING, nama_ibu: DataTypes.STRING, nama_pasangan: DataTypes.STRING, jumlah_anak: DataTypes.INTEGER,
  input_keturunan: DataTypes.STRING, kemungkinan_gen: DataTypes.FLOAT, jenis_inheritance: DataTypes.STRING,
  genotipe_ayah: DataTypes.STRING, genotipe_ibu: DataTypes.STRING, hasil_punnett: DataTypes.STRING,
  pola_pewarisan: DataTypes.STRING, jenis_kelamin_anak: DataTypes.STRING,
  kemungkinan_normal: DataTypes.FLOAT, kemungkinan_carrier: DataTypes.FLOAT, kemungkinan_terdampak: DataTypes.FLOAT,
  external_id: { type: DataTypes.UUID, allowNull: true, unique: false, comment: 'Bridge ID for healthcare queue integration' },
}, { tableName: 'keturunan' });
