import { ref, computed } from 'vue'

const doctors = ref([])
const loading = ref(false)
const error = ref('')
const selectedDoctor = ref(null)
const showSelector = ref(false)
const assigning = ref(false)
const assignResult = ref('')

async function fetchDoctors() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/doctors')
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data dokter')
    doctors.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function openSelector() {
  showSelector.value = true
  selectedDoctor.value = null
  assignResult.value = ''
  if (!doctors.value.length) fetchDoctors()
}

function closeSelector() {
  showSelector.value = false
  selectedDoctor.value = null
  assignResult.value = ''
}

function selectDoctor(doctor) {
  selectedDoctor.value = doctor
}

async function confirmAssign(patientExternalId) {
  if (!selectedDoctor.value || !patientExternalId) return
  assigning.value = true
  assignResult.value = ''
  try {
    // Find queue entry by external_id
    const queueRes = await fetch(`/doctors/queue/external/${patientExternalId}`)
    if (!queueRes.ok) {
      const err = await queueRes.json()
      throw new Error(err.message || 'Pasien tidak ditemukan di antrian healthcare')
    }
    const queueEntry = await queueRes.json()

    // Assign doctor
    const assignRes = await fetch('/doctors/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: queueEntry.id, doctorId: selectedDoctor.value.id })
    })
    if (!assignRes.ok) {
      const err = await assignRes.json()
      throw new Error(err.message || 'Gagal menugaskan dokter')
    }
    assignResult.value = `Berhasil menugaskan ${selectedDoctor.value.name} ke pasien ini.`
    setTimeout(() => { closeSelector() }, 1500)
  } catch (err) {
    assignResult.value = err.message
  } finally {
    assigning.value = false
  }
}

export function useDoctors() {
  return {
    doctors, loading, error, selectedDoctor, showSelector, assigning, assignResult,
    fetchDoctors, openSelector, closeSelector, selectDoctor, confirmAssign
  }
}
