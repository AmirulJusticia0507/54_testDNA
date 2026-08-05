const axios = require('axios');

const HEALTHCARE_API_BASE = process.env.HEALTHCARE_API_BASE || 'http://localhost:5000';
const INTEGRATION_API_KEY = process.env.INTEGRATION_API_KEY;

function integrationHeaders() {
  return INTEGRATION_API_KEY ? { 'X-API-Key': INTEGRATION_API_KEY } : {};
}

async function pushClinicalNotes(queueEntryId, notes) {
  try {
    const res = await axios.patch(`${HEALTHCARE_API_BASE}/api/queue/${queueEntryId}/clinical-notes`, { notes }, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.error('Integration service error (pushClinicalNotes):', err.message);
    throw err;
  }
}

async function getDoctorSchedule(doctorId) {
  try {
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/doctors/${doctorId}/schedule`, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    console.error('Integration service error (getDoctorSchedule):', err.message);
    return null;
  }
}

module.exports = { pushClinicalNotes, getDoctorSchedule };
