-- 54_testDNA MySQL Schema (generated from Sequelize models)
-- Run with: mysql -u root -p dna_analysis_db < schema.sql

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `variant_assessments`;
DROP TABLE IF EXISTS `peningkatan_kinerja_atletik`;
DROP TABLE IF EXISTS `penelitian_ilmiah`;
DROP TABLE IF EXISTS `pasangan_hidup`;
DROP TABLE IF EXISTS `penyakit_genetik`;
DROP TABLE IF EXISTS `keturunan`;
DROP TABLE IF EXISTS `korban_bencana`;
DROP TABLE IF EXISTS `login_logs`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('superadmin','admin','user') NOT NULL DEFAULT 'user',
  `token` VARCHAR(500) DEFAULT NULL,
  `token_expiration` DATETIME DEFAULT NULL,
  `reset_token` VARCHAR(500) DEFAULT NULL,
  `reset_token_expiration` DATETIME DEFAULT NULL,
  `login_attempts` INT NOT NULL DEFAULT 0,
  `locked_until` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `login_logs` (
  `user_id` INT NOT NULL,
  `ip_address` VARCHAR(255) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `logged_in_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_login_logs_user_id` (`user_id`),
  CONSTRAINT `fk_login_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `korban_bencana` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `umur` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `alamat` VARCHAR(500) DEFAULT NULL,
  `jenis_bencana` VARCHAR(100) DEFAULT NULL,
  `kondisi_kesehatan` VARCHAR(255) DEFAULT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `skor_prioritas` INT DEFAULT NULL,
  `kategori_prioritas` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `keturunan` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `nama_ayah` VARCHAR(255) DEFAULT NULL,
  `nama_ibu` VARCHAR(255) DEFAULT NULL,
  `nama_pasangan` VARCHAR(255) DEFAULT NULL,
  `jumlah_anak` INT DEFAULT NULL,
  `input_keturunan` VARCHAR(255) DEFAULT NULL,
  `kemungkinan_gen` FLOAT DEFAULT NULL,
  `jenis_inheritance` VARCHAR(100) DEFAULT NULL,
  `genotipe_ayah` VARCHAR(100) DEFAULT NULL,
  `genotipe_ibu` VARCHAR(100) DEFAULT NULL,
  `hasil_punnett` VARCHAR(255) DEFAULT NULL,
  `pola_pewarisan` VARCHAR(100) DEFAULT NULL,
  `jenis_kelamin_anak` VARCHAR(50) DEFAULT NULL,
  `kemungkinan_normal` FLOAT DEFAULT NULL,
  `kemungkinan_carrier` FLOAT DEFAULT NULL,
  `kemungkinan_terdampak` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `penyakit_genetik` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `riwayat_penyakit` TEXT DEFAULT NULL,
  `jenis_penyakit` VARCHAR(100) DEFAULT NULL,
  `input_identifikasi_penyakit_genetik` TEXT DEFAULT NULL,
  `kemungkinan_kelainan_genetik` FLOAT DEFAULT NULL,
  `hasil_skrining` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pasangan_hidup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `umur` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `alamat` VARCHAR(500) DEFAULT NULL,
  `kriteria_pasangan` VARCHAR(255) DEFAULT NULL,
  `hobi` VARCHAR(255) DEFAULT NULL,
  `pendidikan_terakhir` VARCHAR(100) DEFAULT NULL,
  `status_hubungan` VARCHAR(100) DEFAULT NULL,
  `skor_kecocokan` INT DEFAULT NULL,
  `rekomendasi` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `penelitian_ilmiah` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `input_penelitian_ilmiah` TEXT DEFAULT NULL,
  `hasil_penelitian` TEXT DEFAULT NULL,
  `korelasi` FLOAT DEFAULT NULL,
  `judul` VARCHAR(255) DEFAULT NULL,
  `penulis` VARCHAR(255) DEFAULT NULL,
  `tahun_terbit` INT DEFAULT NULL,
  `penerbit` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `data_x` TEXT DEFAULT NULL,
  `data_y` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `peningkatan_kinerja_atletik` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `usia` INT DEFAULT NULL,
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `nilai_awal` FLOAT DEFAULT NULL,
  `nilai_akhir` FLOAT DEFAULT NULL,
  `peningkatan_kinerja` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `variant_assessments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_name` VARCHAR(255) NOT NULL,
  `gene` VARCHAR(255) NOT NULL,
  `variant_notation` VARCHAR(255) NOT NULL,
  `variant_type` VARCHAR(100) DEFAULT NULL,
  `coverage` FLOAT DEFAULT NULL,
  `base_quality` FLOAT DEFAULT NULL,
  `maf` FLOAT DEFAULT NULL,
  `sanger_status` VARCHAR(100) DEFAULT NULL,
  `segregation_status` VARCHAR(100) DEFAULT NULL,
  `phenotype_match` VARCHAR(100) DEFAULT NULL,
  `skor_bukti` INT DEFAULT NULL,
  `status_review` VARCHAR(100) DEFAULT NULL,
  `klasifikasi_simulasi` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;