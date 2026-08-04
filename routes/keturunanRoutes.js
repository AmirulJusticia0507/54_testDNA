const express = require('express');
const router = express.Router();
const keturunanController = require('../controllers/keturunanController');

// GET all keturunan
router.get('/', keturunanController.getAll);
router.get('/external/:externalId', keturunanController.getByExternalId);

// GET keturunan by ID
router.get('/:id', keturunanController.getById);

// POST a new keturunan
router.post('/', keturunanController.create);

// PUT update keturunan by ID
router.put('/:id', keturunanController.updateById);

// DELETE keturunan by ID
router.delete('/:id', keturunanController.deleteById);

module.exports = router;
