<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '../composables/useAppState'
import { usePatients } from '../composables/usePatients'
import DoctorSelector from '../components/DoctorSelector.vue'
import Charts from '../components/Charts.vue'
import BulkImport from '../components/BulkImport.vue'
import PatientCompare from '../components/PatientCompare.vue'

const router = useRouter()
const { data, analysis } = useAppState()
const { getPatientByExternalId } = usePatients()

const { selected, rows, loading, saving, error, notice, editingId, form,
  config, columns, searchQuery, tablePage, perPage,
  filteredRows, totalTablePages, paginatedRows,
  canWrite, resetForm, load, edit, submit, remove, switchMenu, exportCsv, fieldFilters } = data

const { startAnalysis } = analysis

function handleAnalysis(row) {
  startAnalysis(row)
}

// Doctor selector state
const showDoctorSelector = ref(false)
const selectedPatient = ref(null)

function openDoctorSelector(row) {
  selectedPatient.value = row
  showDoctorSelector.value = true
}

function onDoctorAssigned() {
  showDoctorSelector.value = false
  selectedPatient.value = null
}

// Patient info from healthcare
const patientInfo = ref(null)
const patientInfoLoading = ref(false)

async function showPatientInfo(row) {
  if (!row.external_id) return
  patientInfoLoading.value = true
  patientInfo.value = null
  try {
    patientInfo.value = await getPatientByExternalId(row.external_id)
  } catch {
    patientInfo.value = null
  } finally {
    patientInfoLoading.value = false
  }
}

function hidePatientInfo() {
  patientInfo.value = null
}

// Patient comparison
const showCompare = ref(false)
const compareRows = ref([])

function toggleCompare(row) {
  const idx = compareRows.value.findIndex(r => r.id === row.id)
  if (idx >= 0) {
    compareRows.value.splice(idx, 1)
  } else if (compareRows.value.length < 4) {
    compareRows.value.push(row)
  }
}

function isInCompare(row) {
  return compareRows.value.some(r => r.id === row.id)
}

// Toggle panels
const showCharts = ref(false)
const showImport = ref(false)
const showFilters = ref(false)

watch(selected, () => { if (selected.value) { resetForm(); load() } })
onMounted(() => { load() })
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Dashboard</p>
      <h1 class="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ config.title }}</h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400" v-if="canWrite">Kelola data melalui API Node.js/Express.</p>
      <p class="mt-2 text-slate-600 dark:text-slate-400" v-else>Menampilkan data (read-only).</p>
    </div>

    <div v-if="error" class="mb-5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-red-700 dark:text-red-300">{{ error }}</div>
    <div v-if="notice" class="mb-5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4 text-emerald-700 dark:text-emerald-300">{{ notice }}</div>

    <!-- Toggle buttons -->
    <div class="mb-4 flex gap-2 flex-wrap">
      <button @click="showCharts = !showCharts" class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
        :class="showCharts ? 'bg-indigo-100 text-indigo-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-600'">
        {{ showCharts ? 'Tutup Grafik' : 'Tampilkan Grafik' }}
      </button>
      <button v-if="canWrite" @click="showImport = !showImport" class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
        :class="showImport ? 'bg-indigo-100 text-indigo-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-600'">
        {{ showImport ? 'Tutup Import' : 'Import CSV' }}
      </button>
      <button @click="exportCsv" class="rounded-lg px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 transition">
        Export CSV
      </button>
      <button @click="showFilters = !showFilters" class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
        :class="showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 border border-slate-200 dark:border-slate-600'">
        {{ showFilters ? 'Tutup Filter' : 'Filter Lanjutan' }}
      </button>
      <button v-if="compareRows.length >= 2" @click="showCompare = true" class="rounded-lg px-3 py-1.5 text-xs font-semibold bg-purple-100 text-purple-700 transition">
        Bandingkan ({{ compareRows.length }})
      </button>
    </div>

    <!-- Advanced Filters -->
    <div v-if="showFilters && config.filterFields?.length" class="mb-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 p-4">
      <h3 class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Filter Lanjutan</h3>
      <div class="flex gap-3 flex-wrap">
        <div v-for="ff in config.filterFields" :key="ff.key">
          <label class="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">{{ ff.label }}</label>
          <select v-if="ff.options" v-model="fieldFilters[ff.key]" class="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-xs">
            <option value="">Semua</option>
            <option v-for="opt in ff.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <input v-else v-model="fieldFilters[ff.key]" class="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-xs" />
        </div>
      </div>
    </div>

    <!-- Charts panel -->
    <div v-if="showCharts" class="mb-6">
      <Charts :rows="rows" :columns="columns" :title="'Visualisasi ' + config.title" />
    </div>

    <!-- Bulk Import panel -->
    <div v-if="showImport && canWrite" class="mb-6">
      <BulkImport :endpoint="config.endpoint" :fields="config.fields" :label="config.title" @imported="load" />
    </div>

    <section :class="canWrite ? 'grid gap-6 xl:grid-cols-[380px_1fr]' : ''">
      <!-- FORM (hanya untuk admin & superadmin) -->
      <form v-if="canWrite" class="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm" @submit.prevent="submit">
        <h2 class="mb-5 text-lg font-bold text-slate-900 dark:text-slate-100">{{ editingId ? 'Ubah' : 'Tambah' }} {{ config.title }}</h2>
        <div class="space-y-4">
          <label v-for="field in config.fields" :key="field[0]" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ field[1] }}
            <input v-model="form[field[0]]" :type="field[2]" :placeholder="field[3] || ''" :required="['nama', 'sample_name', 'gene', 'variant_notation'].includes(field[0])"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
        </div>
        <div class="mt-6 flex gap-3">
          <button :disabled="saving" class="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {{ saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah data' }}
          </button>
          <button v-if="editingId" type="button" class="rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 font-semibold" @click="resetForm">Batal</button>
        </div>
      </form>

      <!-- DATA TABLE -->
      <section class="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Data {{ config.title }}</h2>
          <div class="flex items-center gap-3">
            <input v-model="searchQuery" @input="tablePage = 1" type="text" placeholder="Cari data..."
              class="w-48 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            <button class="rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 text-sm font-semibold" @click="searchQuery = ''; tablePage = 1; load()">Muat ulang</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th v-for="field in columns" :key="field[0]" class="whitespace-nowrap px-4 py-3">{{ field[1] }}</th>
                <th v-if="canWrite" class="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500 dark:text-slate-400">Memuat data...</td></tr>
              <tr v-else-if="!paginatedRows.length"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500 dark:text-slate-400">{{ searchQuery ? 'Data tidak ditemukan.' : 'Belum ada data.' }}</td></tr>
              <tr v-for="row in paginatedRows" :key="row.id" class="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td v-for="field in columns" :key="field[0]" class="max-w-xs whitespace-normal px-4 py-3 text-slate-800 dark:text-slate-200">{{ row[field[0]] ?? '-' }}</td>
                <td v-if="canWrite" class="whitespace-nowrap px-4 py-3">
                  <button class="mr-2 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400" @click="handleAnalysis(row)">Analisa</button>
                  <button v-if="row.external_id" class="mr-2 font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400" @click="openDoctorSelector(row)">Pilih Dokter</button>
                  <button v-if="row.external_id" class="mr-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400" @click="showPatientInfo(row)">Info Pasien</button>
                  <button class="mr-2 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" @click="edit(row)">Ubah</button>
                  <button class="mr-2 font-semibold text-red-600 hover:text-red-700 dark:text-red-400" @click="remove(row)">Hapus</button>
                  <button @click="toggleCompare(row)" class="text-xs font-semibold px-1 py-0.5 rounded transition" :class="isInCompare(row) ? 'bg-purple-100 text-purple-700' : 'text-slate-400 hover:text-slate-600'">
                    {{ isInCompare(row) ? '✓' : 'Compare' }}
                  </button>
                </td>
                <td v-else class="whitespace-nowrap px-4 py-3">
                  <button class="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400" @click="handleAnalysis(row)">Analisa</button>
                  <button v-if="row.external_id" class="ml-2 font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400" @click="openDoctorSelector(row)">Pilih Dokter</button>
                  <button v-if="row.external_id" class="ml-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400" @click="showPatientInfo(row)">Info Pasien</button>
                  <button @click="toggleCompare(row)" class="ml-2 text-xs font-semibold px-1 py-0.5 rounded transition" :class="isInCompare(row) ? 'bg-purple-100 text-purple-700' : 'text-slate-400 hover:text-slate-600'">
                    {{ isInCompare(row) ? '✓' : 'Compare' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3">
          <span class="text-xs text-slate-500 dark:text-slate-400">Menampilkan {{ paginatedRows.length }} dari {{ filteredRows.length }} data</span>
          <div class="flex items-center gap-1">
            <button :disabled="tablePage <= 1" @click="tablePage--"
              class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">&laquo;</button>
            <template v-for="p in totalTablePages" :key="p">
              <button v-if="p === tablePage" class="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{{ p }}</button>
              <button v-else-if="Math.abs(p - tablePage) <= 2 || p === 1 || p === totalTablePages" @click="tablePage = p"
                class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">{{ p }}</button>
              <span v-else-if="Math.abs(p - tablePage) === 3" class="px-1 text-xs text-slate-400 dark:text-slate-500">...</span>
            </template>
            <button :disabled="tablePage >= totalTablePages" @click="tablePage++"
                class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">&raquo;</button>
          </div>
        </div>
      </section>
    </section>

    <!-- Patient Info Panel (from Healthcare) -->
    <div v-if="patientInfoLoading" class="mt-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
      <p class="text-sm text-blue-700 dark:text-blue-300">Memuat info pasien dari Healthcare...</p>
    </div>
    <div v-else-if="patientInfo" class="mt-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-blue-800 dark:text-blue-200">Info Pasien (Healthcare)</h3>
        <button @click="hidePatientInfo" class="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Tutup</button>
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><span class="text-slate-500 dark:text-slate-400">Nama:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.name || '-' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">No. RM:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.medical_record_number || '-' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">Jenis Kelamin:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.gender === 'P' ? 'Perempuan' : 'Laki-laki' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">Tgl Lahir:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.date_of_birth || '-' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">Telepon:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.phone || '-' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">Email:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.email || '-' }}</span></div>
        <div class="col-span-2"><span class="text-slate-500 dark:text-slate-400">Alamat:</span> <span class="font-medium text-slate-800 dark:text-slate-200">{{ patientInfo.address || '-' }}</span></div>
        <div><span class="text-slate-500 dark:text-slate-400">External ID:</span> <span class="font-mono text-xs text-slate-600 dark:text-slate-300">{{ patientInfo.external_id || '-' }}</span></div>
      </div>
    </div>

    <!-- Patient Compare Modal -->
    <PatientCompare v-if="showCompare" :rows="compareRows" :columns="columns" @close="showCompare = false" />

    <!-- Doctor Selector Modal -->
    <DoctorSelector
      v-if="showDoctorSelector && selectedPatient"
      :patientExternalId="selectedPatient.external_id"
      :patientName="selectedPatient.nama || selectedPatient.sample_name || selectedPatient.name || ''"
      @close="showDoctorSelector = false"
      @assigned="onDoctorAssigned"
    />
  </div>
</template>
