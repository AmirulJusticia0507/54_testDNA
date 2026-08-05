const axios = require('axios');

const HEALTHCARE_API_BASE = process.env.HEALTHCARE_API_BASE || 'http://localhost:5000';
const INTEGRATION_API_KEY = process.env.INTEGRATION_API_KEY;

function integrationHeaders() {
  return INTEGRATION_API_KEY ? { 'X-API-Key': INTEGRATION_API_KEY } : {};
}

async function getAllPatients({ page, limit, q } = {}) {
  try {
    const params = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (q) params.q = q;
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/patients`, {
      params,
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.error('Patient service error (getAll):', err.message);
    return { items: [], total: 0, page: 1, limit: 20, totalPages: 1 };
  }
}

async function getPatientById(id) {
  try {
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/patients/${id}`, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    console.error('Patient service error (getById):', err.message);
    return null;
  }
}

async function getPatientByExternalId(externalId) {
  try {
    const res = await axios.get(`${HEALTHCARE_API_BASE}/api/patients/external/${externalId}`, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) return null;
    console.error('Patient service error (getByExternalId):', err.message);
    return null;
  }
}

async function createPatient(data) {
  try {
    const res = await axios.post(`${HEALTHCARE_API_BASE}/api/patients`, data, {
      headers: integrationHeaders(),
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    console.error('Patient service error (create):', err.message);
    throw err;
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  getPatientByExternalId,
  createPatient,
};
