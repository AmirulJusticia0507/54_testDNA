const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Auth routes
router.post('/signup', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// User management routes
router.get('/', UserController.getAll);
router.get('/external/:externalId', UserController.getByExternalId);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/unlock/:id', UserController.unlock);
router.get('/logs/:id', UserController.getLogs);

module.exports = router;
