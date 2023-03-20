// di dalam file "identifikasiKorbanBencanaRoutes.js" di dalam folder "routes"
const express = require('express');
const router = express.Router();
const identifikasiKorbanBencanaController = require('../controllers/identifikasiKorbanBencanaController');

// Endpoint untuk mendapatkan daftar korban bencana
router.get('/korban-bencana', identifikasiKorbanBencanaController.getKorbanBencana);

// Endpoint untuk menambahkan korban bencana baru
router.post('/korban-bencana', identifikasiKorbanBencanaController.addKorbanBencana);

// Endpoint untuk mengubah data korban bencana
router.put('/korban-bencana/:id', identifikasiKorbanBencanaController.updateKorbanBencana);

// Endpoint untuk menghapus data korban bencana
router.delete('/korban-bencana/:id', identifikasiKorbanBencanaController.deleteKorbanBencana);

module.exports = router;