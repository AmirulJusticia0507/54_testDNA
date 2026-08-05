<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  endpoint: { type: String, required: true },
  fields: { type: Array, required: true },
  label: { type: String, default: 'Data' }
})

const emit = defineEmits(['imported'])

const fileInput = ref(null)
const csvData = ref([])
const headers = ref([])
const importing = ref(false)
const result = ref('')
const fileName = ref('')

function triggerFileInput() {
  fileInput.value.click()
}

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name
  result.value = ''
  const reader = new FileReader()
  reader.onload = (evt) => {
    const text = evt.target.result
    const lines = text.trim().split('\n')
    if (lines.length < 2) {
      result.value = 'File CSV kosong atau hanya memiliki header.'
      return
    }
    headers.value = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    csvData.value = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row = {}
      headers.value.forEach((h, i) => { row[h] = values[i] || '' })
      return row
    }).filter(row => Object.values(row).some(v => v !== ''))
  }
  reader.readAsText(file)
}

const mappedData = computed(() => {
  return csvData.value.map(row => {
    const mapped = {}
    props.fields.forEach(([key, label]) => {
      mapped[key] = row[key] || row[label] || ''
    })
    return mapped
  })
})

async function doImport() {
  if (!mappedData.value.length) return
  importing.value = true
  result.value = ''
  let success = 0
  let failed = 0
  for (const row of mappedData.value) {
    try {
      const res = await fetch(props.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row)
      })
      if (res.ok) success++
      else failed++
    } catch {
      failed++
    }
  }
  result.value = `Import selesai: ${success} berhasil, ${failed} gagal dari ${mappedData.value.length} total.`
  importing.value = false
  if (success > 0) emit('imported')
}

function clearAll() {
  csvData.value = []
  headers.value = []
  fileName.value = ''
  result.value = ''
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm">
    <h3 class="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
      Import {{ label }} (CSV)
    </h3>

    <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFile" />

    <div v-if="!csvData.length" class="flex flex-col items-center gap-3 py-6 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <p class="text-sm text-slate-500">Pilih file CSV untuk import</p>
      <button @click="triggerFileInput" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
        Pilih File
      </button>
    </div>

    <template v-else>
      <div class="mb-3 flex items-center justify-between">
        <p class="text-sm text-slate-600 dark:text-slate-300">
          <strong>{{ fileName }}</strong> — {{ csvData.length }} baris ditemukan
        </p>
        <button @click="clearAll" class="text-xs text-red-500 hover:text-red-600 font-semibold">Batal</button>
      </div>

      <div class="max-h-48 overflow-auto rounded-lg border border-slate-200 dark:border-slate-600 mb-4">
        <table class="w-full text-xs">
          <thead class="bg-slate-50 dark:bg-slate-700 sticky top-0">
            <tr>
              <th v-for="h in headers" :key="h" class="px-2 py-1.5 text-left font-semibold text-slate-600 dark:text-slate-300">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in csvData.slice(0, 10)" :key="i" class="border-t border-slate-100 dark:border-slate-600">
              <td v-for="h in headers" :key="h" class="px-2 py-1.5 text-slate-700 dark:text-slate-200">{{ row[h] || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="csvData.length > 10" class="text-center py-1 text-xs text-slate-400">...dan {{ csvData.length - 10 }} baris lagi</p>
      </div>

      <button @click="doImport" :disabled="importing" class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 hover:bg-indigo-700 transition">
        {{ importing ? 'Mengimport...' : `Import ${csvData.length} Data` }}
      </button>
    </template>

    <div v-if="result" class="mt-3 rounded-lg p-3 text-sm" :class="result.includes('gagal') ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'">
      {{ result }}
    </div>
  </div>
</template>
