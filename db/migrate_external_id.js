const pool = require('../src/config/database');

async function up() {
  const tables = [
    'users',
    'korban_bencana',
    'penyakit_genetik',
    'keturunan',
    'pasangan_hidup',
    'variant_assessments',
    'penelitian_ilmiah',
    'peningkatan_kinerja_atletik',
  ];

  for (const table of tables) {
    const cols = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = 'external_id'`,
      [table]
    );
    if (cols.rows.length === 0) {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN external_id UUID`);
      // Add unique index
      await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_${table}_external_id ON ${table} (external_id)`);
      console.log(`Added external_id to ${table}`);
    }
  }
  console.log('testDNA migration complete: external_id added to patient tables');
}

up()
  .then(() => { console.log('Migration complete.'); process.exit(0); })
  .catch((err) => { console.error('Migration failed:', err); process.exit(1); });