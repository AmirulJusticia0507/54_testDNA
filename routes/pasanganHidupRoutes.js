const express = require('express');
const pasanganHidupController = require('../controllers/pasanganHidupController');

const router = express.Router();

router.get('/pasangan-hidup', pasanganHidupController.get);

module.exports = router;