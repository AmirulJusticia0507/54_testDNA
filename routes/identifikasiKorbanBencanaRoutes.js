// di dalam file "identifikasiKorbanBencanaRoutes.js" di dalam folder "routes"
const express = require('express');
const router = express.Router();
const identifikasiKorbanBencanaController = require('../controllers/identifikasiKorbanBencanaController');

// Endpoint untuk mendapatkan daftar korban bencana
router.get('/', identifikasiKorbanBencanaController.getAll);
router.get('/:id', identifikasiKorbanBencanaController.getById);

// Endpoint untuk menambahkan korban bencana baru
router.post('/', identifikasiKorbanBencanaController.create);

// Endpoint untuk mengubah data korban bencana
router.put('/:id', identifikasiKorbanBencanaController.updateById);

// Endpoint untuk menghapus data korban bencana
router.delete('/:id', identifikasiKorbanBencanaController.deleteById);

module.exports = router;
