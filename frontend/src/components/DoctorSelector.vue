<script setup>
import { useDoctors } from '../composables/useDoctors'

const props = defineProps({
  patientExternalId: { type: String, required: true },
  patientName: { type: String, default: '' }
})

const emit = defineEmits(['close', 'assigned'])

const { doctors, loading, error, selectedDoctor, showSelector, assigning, assignResult,
  fetchDoctors, closeSelector, selectDoctor, confirmAssign } = useDoctors()

function handleClose() {
  closeSelector()
  emit('close')
}

async function handleConfirm() {
  await confirmAssign(props.patientExternalId)
  if (assignResult.value.startsWith('Berhasil')) {
    emit('assigned')
    setTimeout(() => handleClose(), 1500)
  }
}

// Auto-open
showSelector.value = true
if (!doctors.value.length) fetchDoctors()
</script>

<template>
  <Teleport to="body">
    <div v-if="showSelector" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="handleClose">
      <div class="w-full max-w-lg rounded-2xl bg-white shadow-2xl" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Pilih Dokter</h3>
            <p class="text-sm text-slate-500" v-if="patientName">Untuk: {{ patientName }}</p>
          </div>
          <button @click="handleClose" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <div v-if="loading" class="py-8 text-center text-slate-500">Memuat daftar dokter...</div>
          <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{{ error }}</div>
          <div v-else-if="!doctors.length" class="py-8 text-center text-slate-500">Tidak ada dokter tersedia.</div>
          <div v-else class="space-y-2 max-h-80 overflow-y-auto">
            <button
              v-for="doctor in doctors" :key="doctor.id"
              @click="selectDoctor(doctor)"
              :class="[
                'w-full rounded-xl border-2 p-4 text-left transition',
                selectedDoctor?.id === doctor.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-900">{{ doctor.name }}</p>
                  <p class="text-sm text-slate-500">Klinik #{{ doctor.clinic_id }} | Konsultasi ~{{ doctor.avg_consult_time }} menit</p>
                </div>
                <div v-if="selectedDoctor?.id === doctor.id" class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
            </button>
          </div>

          <!-- Assign result -->
          <div v-if="assignResult" class="mt-4 rounded-lg p-3 text-sm" :class="assignResult.startsWith('Berhasil') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'">
            {{ assignResult }}
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button @click="handleClose" class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Batal</button>
          <button
            @click="handleConfirm"
            :disabled="!selectedDoctor || assigning"
            class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-50 hover:bg-indigo-700"
          >
            {{ assigning ? 'Menugaskan...' : 'Tugaskan Dokter' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
