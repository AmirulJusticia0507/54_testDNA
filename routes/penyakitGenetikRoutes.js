const express = require('express');
const router = express.Router();

// Import controller for Penyakit Genetik
const penyakitGenetikController = require('../controllers/penyakitGenetikController');

// Define route for getting list of penyakit genetik
router.get('/', penyakitGenetikController.getList);

// Define route for getting detail of penyakit genetik
router.get('/:id', penyakitGenetikController.getDetail);

// Define route for creating new penyakit genetik
router.post('/', penyakitGenetikController.create);

// Define route for updating penyakit genetik
router.put('/:id', penyakitGenetikController.update);

// Define route for deleting penyakit genetik
router.delete('/:id', penyakitGenetikController.delete);

module.exports = router;