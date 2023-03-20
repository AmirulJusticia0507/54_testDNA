const express = require('express');
const router = express.Router();
const keturunanController = require('../controllers/keturunanController');

// GET all keturunan
router.get('/', keturunanController.getAllKeturunan);

// GET keturunan by ID
router.get('/:id', keturunanController.getKeturunanById);

// POST a new keturunan
router.post('/', keturunanController.createKeturunan);

// PUT update keturunan by ID
router.put('/:id', keturunanController.updateKeturunan);

// DELETE keturunan by ID
router.delete('/:id', keturunanController.deleteKeturunan);

module.exports = router;