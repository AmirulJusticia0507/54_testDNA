const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('VariantAssessment', {
  sample_name: { type: DataTypes.STRING, allowNull: false }, gene: { type: DataTypes.STRING, allowNull: false },
  variant_notation: { type: DataTypes.STRING, allowNull: false }, variant_type: DataTypes.STRING,
  coverage: DataTypes.FLOAT, base_quality: DataTypes.FLOAT, maf: DataTypes.FLOAT,
  sanger_status: DataTypes.STRING, segregation_status: DataTypes.STRING, phenotype_match: DataTypes.STRING,
  skor_bukti: DataTypes.INTEGER, status_review: DataTypes.STRING, klasifikasi_simulasi: DataTypes.TEXT,
}, { tableName: 'variant_assessments' });
