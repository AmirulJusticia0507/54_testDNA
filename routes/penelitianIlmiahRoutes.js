const express = require('express');
const router = express.Router();

// import controller
const penelitianIlmiahController = require('../controllers/penelitianIlmiahController');

// define routes
router.get('/', penelitianIlmiahController.getAllPenelitianIlmiah);
router.get('/:id', penelitianIlmiahController.getPenelitianIlmiahById);
router.post('/', penelitianIlmiahController.createPenelitianIlmiah);
router.put('/:id', penelitianIlmiahController.updatePenelitianIlmiahById);
router.delete('/:id', penelitianIlmiahController.deletePenelitianIlmiahById);

module.exports = router;