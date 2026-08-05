const patientService = require('../services/patientService');

async function getAllPatients(req, res) {
  try {
    const { page, limit, q } = req.query;
    const result = await patientService.getAllPatients({ page, limit, q });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPatientById(req, res) {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPatientByExternalId(req, res) {
  try {
    const patient = await patientService.getPatientByExternalId(req.params.externalId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createPatient(req, res) {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  getPatientByExternalId,
  createPatient,
};
