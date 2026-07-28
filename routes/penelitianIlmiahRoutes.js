const express = require('express');
const router = express.Router();

// import controller
const penelitianIlmiahController = require('../controllers/penelitianIlmiahController');

// define routes
router.get('/', penelitianIlmiahController.getAll);
router.get('/:id', penelitianIlmiahController.getById);
router.post('/', penelitianIlmiahController.create);
router.put('/:id', penelitianIlmiahController.updateById);
router.delete('/:id', penelitianIlmiahController.deleteById);

module.exports = router;
