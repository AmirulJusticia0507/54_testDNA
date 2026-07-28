const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./db');
require('dotenv').config();

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('gedanggoreng', salt);

    const [user, created] = await User.findOrCreate({
      where: { email: 'superadmmin@gmail.com' },
      defaults: {
        name: 'admin',
        password: hashedPassword,
        role: 'superadmin',
      }
    });

    if (created) {
      console.log('User berhasil dibuat:');
    } else {
      console.log('User sudah ada, mengupdate password:');
      await user.update({ password: hashedPassword });
    }
    console.log('  Email    : superadmmin@gmail.com');
    console.log('  Password : gedanggoreng');
    console.log('  Role     : superadmin');
    console.log('  ID       :', user.id);
    process.exit(0);
  } catch (error) {
    console.error('Gagal:', error.message);
    process.exit(1);
  }
}

seed();
