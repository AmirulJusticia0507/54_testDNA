const express = require('express');
const pasanganHidupController = require('../controllers/pasanganHidupController');

const router = express.Router();

router.get('/', pasanganHidupController.getAll);
router.get('/external/:externalId', pasanganHidupController.getByExternalId);
router.get('/:id', pasanganHidupController.getById);
router.post('/', pasanganHidupController.create);
router.put('/:id', pasanganHidupController.updateById);
router.delete('/:id', pasanganHidupController.deleteById);

module.exports = router;
