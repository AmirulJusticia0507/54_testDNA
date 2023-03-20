// const express = require('express');
// const router = express.Router();
// const UserController = require('../controllers/userController');

// // Signup route
// router.post('/signup', UserController.signup);

// // Login route
// router.post('/login', UserController.login);

// module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const IdentifikasiKorbanBencanaController = require('../controllers/identifikasiKorbanBencanaController');
const IdentifikasiPenyakitGenetikController = require('../controllers/identifikasiPenyakitGenetikController');
const KeturunanController = require('../controllers/keturunanController');
const PasanganHidupController = require('../controllers/pasanganHidupController');
const PenelitianIlmiahController = require('../controllers/penelitianIlmiahController');
const PeningkatanKinerjaAtletikController = require('../controllers/peningkatanKinerjaAtletikController');

// Signup route
router.post('/signup', UserController.signup);

// Login route
router.post('/login', UserController.login);

// Identifikasi Korban Bencana routes
router.get('/identifikasi-korban-bencana', IdentifikasiKorbanBencanaController.getAll);
router.get('/identifikasi-korban-bencana/:id', IdentifikasiKorbanBencanaController.getById);
router.post('/identifikasi-korban-bencana', IdentifikasiKorbanBencanaController.create);
router.put('/identifikasi-korban-bencana/:id', IdentifikasiKorbanBencanaController.updateById);
router.delete('/identifikasi-korban-bencana/:id', IdentifikasiKorbanBencanaController.deleteById);

// Identifikasi Penyakit Genetik routes
router.get('/identifikasi-penyakit-genetik', IdentifikasiPenyakitGenetikController.getAll);
router.get('/identifikasi-penyakit-genetik/:id', IdentifikasiPenyakitGenetikController.getById);
router.post('/identifikasi-penyakit-genetik', IdentifikasiPenyakitGenetikController.create);
router.put('/identifikasi-penyakit-genetik/:id', IdentifikasiPenyakitGenetikController.updateById);
router.delete('/identifikasi-penyakit-genetik/:id', IdentifikasiPenyakitGenetikController.deleteById);

// Keturunan routes
router.get('/keturunan', KeturunanController.getAll);
router.get('/keturunan/:id', KeturunanController.getById);
router.post('/keturunan', KeturunanController.create);
router.put('/keturunan/:id', KeturunanController.updateById);
router.delete('/keturunan/:id', KeturunanController.deleteById);

// Pasangan Hidup routes
router.get('/pasangan-hidup', PasanganHidupController.getAll);
router.get('/pasangan-hidup/:id', PasanganHidupController.getById);
router.post('/pasangan-hidup', PasanganHidupController.create);
router.put('/pasangan-hidup/:id', PasanganHidupController.updateById);
router.delete('/pasangan-hidup/:id', PasanganHidupController.deleteById);

// Penelitian Ilmiah routes
router.get('/penelitian-ilmiah', PenelitianIlmiahController.getAll);
router.get('/penelitian-ilmiah/:id', PenelitianIlmiahController.getById);
router.post('/penelitian-ilmiah', PenelitianIlmiahController.create);
router.put('/penelitian-ilmiah/:id', PenelitianIlmiahController.updateById);
router.delete('/penelitian-ilmiah/:id', PenelitianIlmiahController.deleteById);

// Peningkatan Kinerja Atletik routes
router.get('/peningkatan-kinerja-atletik', PeningkatanKinerjaAtletikController.getAll);
router.get('/peningkatan-kinerja-atletik/:id', PeningkatanKinerjaAtletikController.getById);
router.post('/peningkatan-kinerja-atletik', PeningkatanKinerjaAtletikController.create);
router.put('/peningkatan-kinerja-atletik/:id', PeningkatanKinerjaAtletikController.updateById);
router.delete('/peningkatan-kinerja-atletik/:id', PeningkatanKinerjaAtletikController.deleteById);

module.exports = router;