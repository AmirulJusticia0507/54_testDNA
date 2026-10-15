# AGENTS.md

Aturan wajib untuk agen AI yang bekerja di repo ini:

## 1. Commit & Push WAJIB
Setiap ada perubahan kode (create/edit/delete file) yang dilakukan oleh agent untuk menyelesaikan task, agent WAJIB:
- Melakukan `git add` untuk file yang berubah
- Membuat commit dengan pesan deskriptif dalam bahasa Indonesia atau Inggris yang jelas
- Melakukan `git push` ke branch aktif

**Prosedur wajib:**
```bash
git add .
git commit -m "deskripsi perubahan yang dilakukan"
git push
```

## 2. Git Workflow
- Jangan melakukan destructive operation tanpa konfirmasi (rebase interaktif yang menghapus commit penting, force push ke branch utama) kecuali diminta eksplisit oleh user
- Cek status git (`git status`) sebelum dan sesudah perubahan
- Gunakan pesan commit yang ringkas tapi informatif: `<type>: <deskripsi>`. Contoh: `feat: tambah endpoint AI analyze variant`, `fix: perbaiki validasi API key`, `docs: update README AI config`, `refactor: rapikan aiService`

## 3. Coding Style
- Ikuti pola kode yang sudah ada (controller pakai try/catch + res.status, service pakai axios + error handling)
- Tambah validasi input sederhana di controller
- Gunakan bahasa Indonesia untuk pesan error/user-facing yang konsisten dengan kode eksisting
- Jangan commit secret/credential. Gunakan `.env` (sudah di .gitignore). Kalau terlanjur, segera laporkan.

## 4. Testing & Verifikasi
- Cek syntax dengan `node --check` untuk file JS baru yang dimodifikasi
- Pastikan route terdaftar di `server.js`
- Uji endpoint sederhana jika diperlukan (tidak wajib, tapi baik)

## 5. Dokumentasi
- Update README.md jika ada perubahan konfigurasi/env atau fitur baru yang perlu diketahui user

## 6. Prioritas Keamanan
- Jangan expose API key atau secret di log
- Validasi env vars yang wajib sebelum dipakai (throw error jelas)

---

**PRINSIP UTAMA:** Setelah setiap task selesai, COMMIT + PUSH adalah WAJIB, tidak boleh ditunda.
