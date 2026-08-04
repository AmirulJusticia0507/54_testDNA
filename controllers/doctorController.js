const doctorService = require('../services/doctorService');

async function getAllDoctors(req, res) {
  try {
    const clinicId = req.query.clinic || null;
    const doctors = await doctorService.getAllDoctors(clinicId);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDoctorByExternalId(req, res) {
  try {
    const doctor = await doctorService.getDoctorByExternalId(req.params.externalId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDoctorById(req, res) {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getQueueEntryByExternalId(req, res) {
  try {
    const entry = await doctorService.getQueueEntryByExternalId(req.params.externalId);
    if (!entry) return res.status(404).json({ message: 'Queue entry not found for this patient' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function assignDoctor(req, res) {
  try {
    const { patientId, doctorId } = req.body;
    if (!patientId || !doctorId) return res.status(400).json({ message: 'patientId and doctorId required' });
    const entry = await doctorService.assignDoctor(patientId, doctorId);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllDoctors,
  getDoctorByExternalId,
  getDoctorById,
  getQueueEntryByExternalId,
  assignDoctor,
};
