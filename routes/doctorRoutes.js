const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/external/:externalId', doctorController.getDoctorByExternalId);
router.get('/queue/external/:externalId', doctorController.getQueueEntryByExternalId);
router.post('/assign', doctorController.assignDoctor);
router.get('/:id', doctorController.getDoctorById);
router.get('/', doctorController.getAllDoctors);

module.exports = router;
