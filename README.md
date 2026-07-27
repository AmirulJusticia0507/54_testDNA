# DNA Analysis Dashboard

Aplikasi manajemen data analisis DNA dengan backend Node.js/Express, MySQL, serta frontend Vue 3 dan Tailwind CSS.

## Teknologi

- Backend: Node.js, Express, Sequelize
- Database: MySQL
- Frontend: Vue 3, Vite, Tailwind CSS

## Struktur proyek

```text
54_testDNA/
├─ controllers/       # Logika API CRUD
├─ models/            # Model Sequelize/MySQL
├─ routes/            # Endpoint Express
├─ frontend/          # Dashboard Vue + Tailwind
├─ db.js              # Koneksi MySQL
├─ server.js          # Server API
└─ .env               # Konfigurasi lokal
```

## Persiapan MySQL

Pastikan MySQL pada Laragon sudah berjalan. Buat database bernama `dna_analysis_db` melalui HeidiSQL/phpMyAdmin, atau jalankan:

```bash
CREATE DATABASE dna_analysis_db;
```

Lalu atur file `.env` di root proyek. Konfigurasi bawaan Laragon biasanya menggunakan user `root` tanpa password:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=dna_analysis_db
DB_USER=root
DB_PASSWORD=
TOKEN_SECRET=ganti-dengan-rahasia-yang-aman
```

Saat backend tersambung, Sequelize akan membuat tabel yang diperlukan secara otomatis.

## Menjalankan backend

Di root proyek:

```bash
npm install
npm start
```

Backend berjalan di `http://localhost:3000`.

## Menjalankan frontend

Buka terminal kedua:

```bash
cd frontend
npm install
npm run dev
```

Buka dashboard di `http://localhost:5173`. Vite akan meneruskan request API ke backend pada port `3000`.

## Endpoint CRUD

Semua endpoint mendukung `GET`, `POST`, `PUT /:id`, dan `DELETE /:id`.

| Data | Endpoint |
| --- | --- |
| Korban bencana | `/korban-bencana` |
| Penyakit genetik | `/penyakit-genetik` |
| Keturunan | `/keturunan` |
| Pasangan hidup | `/pasangan-hidup` |
| Penelitian ilmiah | `/penelitian-ilmiah` |
| Kinerja atletik | `/peningkatan-kinerja-atletik` |
| Variant assessment | `/variant-assessments` |

Autentikasi pengguna tersedia melalui `POST /users/signup` dan `POST /users/login`.

## Perhitungan modul

Perhitungan dilakukan di backend saat data ditambah atau diubah.

| Modul | Perhitungan |
| --- | --- |
| Korban bencana | Skor prioritas berdasarkan kondisi kesehatan dan usia rentan. |
| Penyakit genetik | Simulasi rasio basa `G` pada sekuens A/C/G/T; bukan diagnosis medis. |
| Keturunan | Model Mendel autosomal dominan, autosomal resesif, dan X-linked recessive. |
| Pasangan hidup | Skor kecocokan dari usia, hobi, pendidikan, dan status hubungan. |
| Penelitian ilmiah | Korelasi Pearson dari dua deret angka yang dipisahkan koma. |
| Kinerja atletik | Persentase perubahan: `((nilai akhir - nilai awal) / nilai awal) × 100`. |
| Variant assessment | Skor bukti teknis: coverage, base quality, MAF, konfirmasi Sanger, segregasi, dan kecocokan fenotipe. Hasilnya status review, bukan klasifikasi ACMG resmi atau diagnosis. |

## Verifikasi

```bash
# Memeriksa sintaks backend
npm test

# Membuat build frontend
cd frontend
npm run build
```
