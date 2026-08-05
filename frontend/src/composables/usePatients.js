import { ref } from 'vue'
import axios from 'axios'

const patients = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchPatients({ page, limit, q } = {}) {
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (q) params.q = q
    const res = await axios.get('/patients', { params })
    patients.value = res.data.items || res.data
    return res.data
  } catch (err) {
    error.value = err.response?.data?.error || err.message
    return { items: [], total: 0 }
  } finally {
    loading.value = false
  }
}

async function getPatientByExternalId(externalId) {
  try {
    const res = await axios.get(`/patients/external/${externalId}`)
    return res.data
  } catch {
    return null
  }
}

export function usePatients() {
  return {
    patients,
    loading,
    error,
    fetchPatients,
    getPatientByExternalId,
  }
}
