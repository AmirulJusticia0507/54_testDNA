const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const User = require('./models/User');
const KorbanBencana = require('./models/KorbanBencana');
const PenyakitGenetik = require('./models/PenyakitGenetik');
const Keturunan = require('./models/Keturunan');
const PasanganHidup = require('./models/PasanganHidup');
const PenelitianIlmiah = require('./models/PenelitianIlmiah');
const PeningkatanKinerjaAtletik = require('./models/PeningkatanKinerjaAtletik');
const VariantAssessment = require('./models/VariantAssessment');
const sequelize = require('./db');
require('dotenv').config();

// Fixed UUIDs matching healthcare-queue seed
const EXTERNAL_IDS = {
  budi: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  siti: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  ahmad: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
};

async function seed() {
  try {
    await sequelize.authenticate();
    
    // Sync all models EXCEPT User (to avoid index limit issue)
    await KorbanBencana.sync({ alter: true });
    await PenyakitGenetik.sync({ alter: true });
    await Keturunan.sync({ alter: true });
    await PasanganHidup.sync({ alter: true });
    await PenelitianIlmiah.sync({ alter: true });
    await PeningkatanKinerjaAtletik.sync({ alter: true });
    await VariantAssessment.sync({ alter: true });

    // Add external_id column to users via raw SQL (avoid index limit)
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN external_id CHAR(36) NULL
    `).catch(() => {});
    await sequelize.query(`
      ALTER TABLE penelitian_ilmiah ADD COLUMN external_id CHAR(36) NULL
    `).catch(() => {});
    await sequelize.query(`
      ALTER TABLE peningkatan_kinerja_atletik ADD COLUMN external_id CHAR(36) NULL
    `).catch(() => {});
    await sequelize.query(`
      ALTER TABLE variant_assessments ADD COLUMN external_id CHAR(36) NULL
    `).catch(() => {});
    console.log('Added external_id columns (raw SQL)');

    // Superadmin user
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('gedanggoreng', salt);

    const [user, created] = await User.findOrCreate({
      where: { email: 'superadmin@gmail.com' },
      defaults: {
        name: 'admin',
        password: hashedPassword,
        role: 'superadmin',
        external_id: EXTERNAL_IDS.budi,
      }
    });

    if (created) {
      console.log('Superadmin user created:');
    } else {
      console.log('Superadmin user exists, updating password & external_id:');
      await user.update({ password: hashedPassword, external_id: EXTERNAL_IDS.budi });
    }
    console.log('  Email    : superadmin@gmail.com');
    console.log('  Password : gedanggoreng');
    console.log('  Role     : superadmin');
    console.log('  ID       :', user.id);
    console.log('  external_id:', user.external_id);

    // Seed sample patient data across all models with matching external_ids
    const patients = [
      {
        external_id: EXTERNAL_IDS.budi,
        name: 'Budi Santoso',
        age: 35,
        gender: 'Laki-laki',
      },
      {
        external_id: EXTERNAL_IDS.siti,
        name: 'Siti Rahayu',
        age: 28,
        gender: 'Perempuan',
      },
      {
        external_id: EXTERNAL_IDS.ahmad,
        name: 'Ahmad Wijaya',
        age: 42,
        gender: 'Laki-laki',
      },
    ];

    // KorbanBencana
    for (const p of patients) {
      await KorbanBencana.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          umur: p.age,
          jenis_kelamin: p.gender,
          alamat: 'Jl. Contoh No. 123, Jakarta',
          jenis_bencana: 'Banjir',
          kondisi_kesehatan: 'Stabil',
          keterangan: 'Korban banjir Jakarta 2024',
          skor_prioritas: 7,
          kategori_prioritas: 'Tinggi',
        }
      });
    }
    console.log('Seeded KorbanBencana with external_ids');

    // PenyakitGenetik
    for (const p of patients) {
      await PenyakitGenetik.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          jenis_kelamin: p.gender,
          riwayat_penyakit: 'Diabetes tipe 2, Hipertensi',
          jenis_penyakit: 'Penakit metabolik',
          input_identifikasi_penyakit_genetik: 'Genetik screening panel',
          kemungkinan_kelainan_genetik: 0.15,
          hasil_skrining: 'Positif risak genetik metabolik',
        }
      });
    }
    console.log('Seeded PenyakitGenetik with external_ids');

    // Keturunan
    for (const p of patients) {
      await Keturunan.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          jenis_kelamin: p.gender,
          nama_ayah: p.name + ' (Ayah)',
          nama_ibu: p.name + ' (Ibu)',
          nama_pasangan: p.gender === 'Laki-laki' ? 'Ibu' : 'Ayah',
          jumlah_anak: 2,
          input_keturunan: 'Autosomal dominant',
          kemungkinan_gen: 0.5,
          jenis_inheritance: 'Autosomal Dominan',
          genotipe_ayah: 'Aa',
          genotipe_ibu: 'aa',
          hasil_punnett: 'Aa, aa, Aa, aa',
          pola_pewarisan: '50% keturunan terdampak',
          jenis_kelamin_anak: p.gender,
          kemungkinan_normal: 0.5,
          kemungkinan_carrier: 0.25,
          kemungkinan_terdampak: 0.25,
        }
      });
    }
    console.log('Seeded Keturunan with external_ids');

    // PasanganHidup
    for (const p of patients) {
      await PasanganHidup.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          umur: p.age,
          jenis_kelamin: p.gender,
          alamat: 'Jl. Contoh No. 123, Jakarta',
          kriteria_pasangan: 'Sehat, sejenis usia',
          hobi: 'Membaca, Olahraga',
          pendidikan_terakhir: 'S1',
          status_hubungan: 'Menikah',
          skor_kecocokan: 85,
          rekomendasi: 'Sangat cocok',
        }
      });
    }
    console.log('Seeded PasanganHidup with external_ids');

    // PenelitianIlmiah
    for (const p of patients) {
      await PenelitianIlmiah.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          jenis_kelamin: p.gender,
          input_penelitian_ilmiah: 'Studi kasus genetik',
          hasil_penelitian: 'Ditemukan varian baru',
          korelasi: 0.78,
          judul: 'Analisis Genetik Kasus ' + p.name,
          penulis: 'Dr. Genetik',
          tahun_terbit: 2024,
          penerbit: 'Jurnal Genetika Indonesia',
          url: 'https://example.com/study/' + p.external_id,
          data_x: JSON.stringify([1,2,3,4,5]),
          data_y: JSON.stringify([2,4,6,8,10]),
        }
      });
    }
    console.log('Seeded PenelitianIlmiah with external_ids');

    // PeningkatanKinerjaAtletik
    for (const p of patients) {
      await PeningkatanKinerjaAtletik.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          nama: p.name,
          usia: p.age,
          jenis_kelamin: p.gender,
          nilai_awal: 65.5,
          nilai_akhir: 82.3,
          peningkatan_kinerja: 'Peningkatan signifikan setelah intervensi genetik',
        }
      });
    }
    console.log('Seeded PeningkatanKinerjaAtletik with external_ids');

    // VariantAssessment
    for (const p of patients) {
      await VariantAssessment.findOrCreate({
        where: { external_id: p.external_id },
        defaults: {
          sample_name: p.name,
          gene: 'BRCA1',
          variant_notation: 'c.68_69delAG',
          variant_type: 'frameshift',
          coverage: 150.0,
          base_quality: 35.2,
          maf: 0.001,
          sanger_status: 'confirmed',
          segregation_status: 'segregates',
          phenotype_match: 'yes',
          skor_bukti: 8,
          status_review: 'Pathogenic',
          klasifikasi_simulasi: 'Class 5 - Pathogenic',
        }
      });
    }
    console.log('Seeded VariantAssessment with external_ids');

    console.log('\n=== All seed data created successfully ===');
    console.log('External IDs available for bridge testing:');
    console.log('  Budi Santoso  :', EXTERNAL_IDS.budi);
    console.log('  Siti Rahayu   :', EXTERNAL_IDS.siti);
    console.log('  Ahmad Wijaya  :', EXTERNAL_IDS.ahmad);

    process.exit(0);
  } catch (error) {
    console.error('Gagal:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();