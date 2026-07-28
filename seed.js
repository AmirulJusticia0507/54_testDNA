const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./db');
require('dotenv').config();

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const existing = await User.findOne({ where: { email: 'superadmin@dna.com' } });
    if (existing) {
      console.log('Superadmin sudah ada:', existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    const user = await User.create({
      name: 'Super Admin',
      email: 'superadmin@dna.com',
      password: hashedPassword,
      role: 'superadmin',
    });

    console.log('Superadmin berhasil dibuat:');
    console.log('  Email    : superadmin@dna.com');
    console.log('  Password : superadmin123');
    console.log('  Role     : superadmin');
    console.log('  ID       :', user.id);
    process.exit(0);
  } catch (error) {
    console.error('Gagal seed:', error.message);
    process.exit(1);
  }
}

seed();
