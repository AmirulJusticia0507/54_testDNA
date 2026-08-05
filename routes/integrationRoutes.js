const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');

router.post('/clinical-notes', integrationController.pushClinicalNotes);
router.get('/doctor-schedule/:id', integrationController.getDoctorSchedule);

module.exports = router;
