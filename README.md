# DNA Analysis Dashboard

Aplikasi manajemen data analisis DNA dengan backend Node.js/Express, PostgreSQL, serta frontend Vue 3 dan Tailwind CSS.

## Teknologi

- Backend: Node.js, Express, Sequelize
- Database: PostgreSQL
- Frontend: Vue 3, Vite, Tailwind CSS

## Struktur proyek

```text
54_testDNA/
├─ controllers/       # Logika API CRUD
├─ models/            # Model Sequelize/PostgreSQL
├─ routes/            # Endpoint Express
├─ frontend/          # Dashboard Vue + Tailwind
├─ db.js              # Koneksi PostgreSQL
├─ server.js          # Server API
└─ .env               # Konfigurasi lokal
```

## Persiapan PostgreSQL

Pastikan PostgreSQL sudah terpasang dan servicenya berjalan. Buat database bernama `dna_analysis_db`:

```bash
createdb -U postgres dna_analysis_db
```

Atau buat database tersebut melalui pgAdmin. Lalu atur file `.env` di root proyek:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=dna_analysis_db
DB_USER=postgres
DB_PASSWORD=PASSWORD_POSTGRES_KAMU
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

Autentikasi pengguna tersedia melalui `POST /users/signup` dan `POST /users/login`.

## Verifikasi

```bash
# Memeriksa sintaks backend
npm test

# Membuat build frontend
cd frontend
npm run build
```
