const axios = require('axios');

const HEALTHCARE_API_BASE = process.env.HEALTHCARE_API_BASE || 'http://localhost:5000';
const INTEGRATION_API_KEY = process.env.INTEGRATION_API_KEY;

function integrationHeaders() {
  return INTEGRATION_API_KEY ? { 'X-API-Key': INTEGRATION_API_KEY } : {};
}

async function getAllDoctors(clinicId) {
  try {
    const params = clinicId ? { clinic: clinicId } : {};
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/doctors`, {
      params,
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.error('Doctor service error (getAll):', err.message);
    return [];
  }
}

async function getDoctorByExternalId(externalId) {
  try {
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/doctors/external/${externalId}`, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    console.error('Doctor service error (getByExternalId):', err.message);
    return null;
  }
}

async function getDoctorById(id) {
  try {
    const doctors = await getAllDoctors();
    return doctors.find(d => d.id === Number(id)) || null;
  } catch (err) {
    console.error('Doctor service error (getById):', err.message);
    return null;
  }
}

async function getQueueEntryByExternalId(externalId) {
  try {
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/doctors/queue/external/${externalId}`, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    console.error('Doctor service error (getQueueEntry):', err.message);
    return null;
  }
}

async function assignDoctor(patientId, doctorId) {
  try {
    const res = await axios.patch(`${HEALTHCARE_API_BASE}/api/doctors/assign/${patientId}`, { doctorId }, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.error('Doctor service error (assign):', err.message);
    throw err;
  }
}

module.exports = {
  getAllDoctors,
  getDoctorByExternalId,
  getDoctorById,
  getQueueEntryByExternalId,
  assignDoctor,
};
