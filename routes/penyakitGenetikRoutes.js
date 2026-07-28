const express = require('express');
const router = express.Router();

// Import controller for Penyakit Genetik
const penyakitGenetikController = require('../controllers/identifikasiPenyakitGenetikController');

// Define route for getting list of penyakit genetik
router.get('/', penyakitGenetikController.getAll);

// Define route for getting detail of penyakit genetik
router.get('/:id', penyakitGenetikController.getById);

// Define route for creating new penyakit genetik
router.post('/', penyakitGenetikController.create);

// Define route for updating penyakit genetik
router.put('/:id', penyakitGenetikController.updateById);

// Define route for deleting penyakit genetik
router.delete('/:id', penyakitGenetikController.deleteById);

module.exports = router;
