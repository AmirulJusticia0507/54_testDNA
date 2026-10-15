const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.chat);
router.post('/image', aiController.image);
router.post('/analyze/variant/:id', aiController.analyzeVariant);
router.post('/analyze/disease/:id', aiController.analyzeDiseaseGenetic);

module.exports = router;