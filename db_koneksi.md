# Database Connection - 54_testDNA (DNA Analysis)

## MySQL (Local Dev)

| Field    | Value          |
|----------|----------------|
| Host     | `127.0.0.1`   |
| Port     | `3306`         |
| Database | `dna_analysis_db` |
| User     | `root`         |
| Password | `password123`  |
| Engine   | MySQL 8        |

### Beekeeper Studio Setup

1. Buka Beekeeper Studio
2. Klik **New Connection**
3. Pilih **MySQL**
4. Isi:
   - Host: `127.0.0.1`
   - Port: `3306`
   - Database: `dna_analysis_db`
   - User: `root`
   - Password: `password123`
5. Klik **Test Connection** lalu **Save**

### Tables

| Table                          | Fungsi                                  |
|--------------------------------|-----------------------------------------|
| `users`                        | Auth + pasien DNA (external_id bridge)  |
| `korban_bencana`               | Data korban bencana                     |
| `penyakit_genetik`             | Data penyakit genetik                   |
| `keturunan`                    | Data keturunan / inheritance            |
| `pasangan_hidup`               | Data pasangan hidup                     |
| `penelitian_ilmiah`            | Data penelitian ilmiah                  |
| `peningkatan_kinerja_atletik`  | Data kinerja atletik                    |
| `variant_assessments`          | Data variant assessment                 |
| `login_logs`                   | Log aktivitas login                     |

### User Login

| Email              | Password        | Role        |
|--------------------|-----------------|-------------|
| superadmin@gmail.com | gedanggoreng  | superadmin  |
| test@test.com      | _(seed manual)_ | user        |

### Field `external_id` (Bridge ke Healthcare Queue)

Semua tabel pasien punya kolom `external_id` (UUID) untuk integrasi dengan Healthcare Queue.

Contoh seed data:

| external_id                              | Nama           |
|------------------------------------------|----------------|
| `a1b2c3d4-e5f6-7890-abcd-ef1234567890`  | Budi Santoso   |
| `b2c3d4e5-f6a7-8901-bcde-f23456789012`  | Siti Rahayu    |
| `c3d4e5f6-a7b8-9012-cdef-345678901234`  | Ahmad Wijaya   |

### API Endpoints (Lookup by external_id)

```
GET /korban-bencana/external/:externalId
GET /penyakit-genetik/external/:externalId
GET /keturunan/external/:externalId
GET /pasangan-hidup/external/:externalId
GET /penelitian-ilmiah/external/:externalId
GET /peningkatan-kinerja-atletik/external/:externalId
GET /variant-assessments/external/:externalId
GET /users/external/:externalId
```

---

## Docker (Production / CI)

Saat pakai Docker Compose:

| Field    | Value             |
|----------|-------------------|
| Host     | `mysql` (service) |
| Port     | `3306`            |
| User     | `root`            |
| Password | `password123`     |

Docker Compose port mapping: `3307:3306` (host:container) agar tidak conflict dengan MySQL local di port 3306.
