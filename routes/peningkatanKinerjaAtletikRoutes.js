const express = require('express');
const router = express.Router();

// Import controller
const peningkatanKinerjaAtletikController = require('../controllers/peningkatanKinerjaAtletikController');

// Define routes
router.get('/', peningkatanKinerjaAtletikController.getAll);
router.get('/:id', peningkatanKinerjaAtletikController.getById);
router.post('/', peningkatanKinerjaAtletikController.create);
router.put('/:id', peningkatanKinerjaAtletikController.update);
router.delete('/:id', peningkatanKinerjaAtletikController.delete);

module.exports = router;