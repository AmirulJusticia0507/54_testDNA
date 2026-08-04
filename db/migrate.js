const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { logging: false })
  : new Sequelize(
      process.env.DB_NAME || 'dna_analysis_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
      }
    );

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Database connection OK');

    // Load all models to register them
    require('../models/User');
    require('../models/LoginLog');
    require('../models/PenyakitGenetik');
    require('../models/Keturunan');
    require('../models/KorbanBencana');
    require('../models/PasanganHidup');
    require('../models/PenelitianIlmiah');
    require('../models/PeningkatanKinerjaAtletik');
    require('../models/VariantAssessment');

    // Sync all models (alter: true = safe schema updates)
    await sequelize.sync({ alter: true });
    console.log('Migration complete: all tables synced');

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();