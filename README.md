# DNA Analysis Dashboard

Aplikasi manajemen data analisis DNA dengan backend Node.js/Express, MySQL, serta frontend Vue 3 dan Tailwind CSS.

## Teknologi

- Backend: Node.js, Express, Sequelize
- Database: MySQL
- Frontend: Vue 3, Vite, Tailwind CSS

## Struktur proyek

```text
54_testDNA/
├─ controllers/          # Logika API CRUD
├─ models/               # Model Sequelize/MySQL
├─ routes/               # Endpoint Express
├─ middleware/            # Auth & error handler
├─ config/               # JWT config
├─ frontend/             # Dashboard Vue + Tailwind
│   └─ src/
│       └─ composables/  # useAuth, useData, useUsers, useAnalysis
├─ db.js                 # Koneksi MySQL
├─ server.js             # Server API
├─ seed.js               # Seed superadmin user
├─ .env                  # Konfigurasi lokal
└─ DNA_Analysis_API.postman_collection.json
```

## OpenCode Setup

Projek ini sudah dikonfigurasi untuk OpenCode. Agar bisa langsung jalan, letakkan file `auth.json` di `~/.local/share/opencode/auth.json`:

```json
{
  "openai": {
    "type": "api_key",
    "key": "sk-proj-...your-key-here..."
  }
}
```

Atau jalankan command berikut untuk login langsung:

```bash
opencode auth login
```

```bash
opencode -s ses_0596259d2ffedhKDRqJJSkttre
```

## Persiapan MySQL

Pastikan MySQL sudah berjalan. Buat database bernama `dna_analysis_db`:

```sql
CREATE DATABASE dna_analysis_db;
```

Lalu atur file `.env` di root proyek:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=dna_analysis_db
DB_USER=root
DB_PASSWORD=password123
TOKEN_SECRET=ganti-dengan-rahasia-yang-aman
DB_SYNC_ALTER=true
```

Buat user MySQL untuk koneksi TCP (karena MySQL 8.4 menghapus `mysql_native_password`):

```sql
CREATE USER 'root'@'127.0.0.1' IDENTIFIED WITH caching_sha2_password BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Seed superadmin:

```bash
node seed.js
```

## Menjalankan backend

```bash
npm install
npm start
```

Backend berjalan di `http://localhost:3000`.

## Menjalankan frontend

```bash
cd frontend
npm install
npm run dev
```

Buka dashboard di `http://localhost:5173`. Vite akan meneruskan request API ke backend pada port `3000`.

## Build frontend untuk produksi

```bash
cd frontend
npx vite build
```

File hasil build ada di `frontend/dist/` dan akan di-serve otomatis oleh Express.

## Akun default

| Role | Email | Password |
| --- | --- | --- |
| Superadmin | superadmmin@gmail.com | gedanggoreng |

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

## Auth & Role

| Endpoint | Method | Deskripsi |
| --- | --- | --- |
| `/users/signup` | POST | Register user baru |
| `/users/login` | POST | Login, dapatkan JWT token |
| `/users/forgot-password` | POST | Minta token reset |
| `/users/reset-password` | POST | Reset password pakai token |
| `/users` | GET | List semua user (superadmin) |
| `/users/:id` | PUT | Update user (superadmin) |
| `/users/:id` | DELETE | Hapus user (superadmin) |

| Role | Akses |
| --- | --- |
| Superadmin | Semua modul + Manage Users + CRUD |
| Admin | Semua modul + CRUD |
| User | Semua modul (read-only) + Analisa |

## Fitur

- Landing page dengan hero section
- Login + forgot/reset password
- 7 modul data analisis DNA
- Form input + perhitungan otomatis
- Search/filter + pagination
- Tombol **Analisa** → signature pad → laporan naratif + cetak + QR code verifikasi
- Role-based access control
- Spinner animasi DNA helix

## Perhitungan modul

| Modul | Perhitungan |
| --- | --- |
| Korban bencana | Skor prioritas berdasarkan kondisi kesehatan dan usia rentan. |
| Penyakit genetik | Simulasi rasio basa G pada sekuens A/C/G/T. |
| Keturunan | Model Mendel autosomal dominan, autosomal resesif, dan X-linked recessive. |
| Pasangan hidup | Skor kecocokan dari usia, hobi, pendidikan, dan status hubungan. |
| Penelitian ilmiah | Korelasi Pearson dari dua deret angka. |
| Kinerja atletik | Persentase perubahan performa. |
| Variant assessment | Skor bukti klinis dari coverage, base quality, MAF, Sanger, segregasi, fenotipe. |
