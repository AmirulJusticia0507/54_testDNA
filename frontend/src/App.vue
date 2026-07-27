<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'

const resources = {
  korban: {
    title: 'Korban Bencana', endpoint: '/korban-bencana',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['kondisi_kesehatan', 'Kondisi kesehatan', 'text'], ['jenis_bencana', 'Jenis bencana', 'text']
    ], results: [['skor_prioritas', 'Skor prioritas'], ['kategori_prioritas', 'Kategori']]
  },
  penyakit: {
    title: 'Penyakit Genetik', endpoint: '/penyakit-genetik',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['riwayat_penyakit', 'Riwayat penyakit', 'text'], ['jenis_penyakit', 'Jenis penyakit', 'text'], ['input_identifikasi_penyakit_genetik', 'Sekuens DNA (A/C/G/T)', 'text']
    ], results: [['kemungkinan_kelainan_genetik', 'Rasio G'], ['hasil_skrining', 'Hasil skrining']]
  },
  keturunan: {
    title: 'Keturunan', endpoint: '/keturunan',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nama_ayah', 'Nama ayah', 'text'], ['nama_ibu', 'Nama ibu', 'text'], ['genotipe_ayah', 'Genotipe ayah (AA/Aa/aa)', 'text'], ['genotipe_ibu', 'Genotipe ibu (AA/Aa/aa)', 'text']
    ], results: [['hasil_punnett', 'Hasil Punnett square']]
  },
  pasangan: {
    title: 'Pasangan Hidup', endpoint: '/pasangan-hidup',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['hobi', 'Hobi', 'text'],
      ['pendidikan_terakhir', 'Pendidikan terakhir', 'text'], ['status_hubungan', 'Status hubungan', 'text']
    ], results: [['skor_kecocokan', 'Skor kecocokan'], ['rekomendasi', 'Rekomendasi']]
  },
  penelitian: {
    title: 'Penelitian Ilmiah', endpoint: '/penelitian-ilmiah',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['input_penelitian_ilmiah', 'Judul/data penelitian', 'text'], ['data_x', 'Data X (pisahkan koma)', 'text'], ['data_y', 'Data Y (pisahkan koma)', 'text']
    ], results: [['korelasi', 'Korelasi Pearson'], ['hasil_penelitian', 'Hasil']]
  },
  atletik: {
    title: 'Kinerja Atletik', endpoint: '/peningkatan-kinerja-atletik',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nilai_awal', 'Nilai awal', 'number'], ['nilai_akhir', 'Nilai akhir', 'number']
    ], results: [['peningkatan_kinerja', 'Peningkatan (%)']]
  }
}

const selected = ref('korban')
const rows = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const notice = ref('')
const editingId = ref(null)
const form = reactive({})
const config = computed(() => resources[selected.value])
const columns = computed(() => [...config.value.fields, ...(config.value.results || [])])

function resetForm() {
  editingId.value = null
  Object.keys(form).forEach((key) => delete form[key])
  config.value.fields.forEach(([key]) => { form[key] = '' })
}

function messageFrom(response, fallback) {
  return response?.message || fallback
}

async function parseResponse(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: `Server mengirim respons tidak valid (${response.status}).` }
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(config.value.endpoint)
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(messageFrom(data, 'Gagal mengambil data.'))
    rows.value = data
  } catch (err) {
    error.value = `${err.message} Pastikan backend Node.js berjalan di port 3000.`
  } finally {
    loading.value = false
  }
}

function edit(row) {
  editingId.value = row.id
  config.value.fields.forEach(([key]) => { form[key] = row[key] ?? '' })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submit() {
  saving.value = true
  error.value = ''
  notice.value = ''
  const payload = {}
  config.value.fields.forEach(([key, , type]) => {
    payload[key] = type === 'number' && form[key] !== '' ? Number(form[key]) : form[key]
  })
  try {
    const url = editingId.value ? `${config.value.endpoint}/${editingId.value}` : config.value.endpoint
    const response = await fetch(url, {
      method: editingId.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(messageFrom(data, 'Gagal menyimpan data.'))
    notice.value = editingId.value ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.'
    resetForm()
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  if (!window.confirm(`Hapus data ${row.nama || 'ini'}?`)) return
  error.value = ''
  try {
    const response = await fetch(`${config.value.endpoint}/${row._id}`, { method: 'DELETE' })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(messageFrom(data, 'Gagal menghapus data.'))
    notice.value = 'Data berhasil dihapus.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}

watch(selected, () => { resetForm(); load() })
onMounted(() => { resetForm(); load() })
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-8">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 font-bold text-white">DNA</div>
        <div><p class="font-bold text-slate-900">DNA Analysis</p><p class="text-xs text-slate-500">Sistem manajemen data</p></div>
      </div>
      <div class="flex items-center gap-3"><span class="hidden text-sm text-slate-500 sm:inline">Administrator</span><div class="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">A</div></div>
    </header>

    <div class="mx-auto flex max-w-screen-2xl">
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <p class="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Menu Data</p>
        <nav class="space-y-1">
          <button v-for="(item, key) in resources" :key="key" @click="selected = key"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
            :class="selected === key ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'">
            {{ item.title }}
          </button>
        </nav>
      </aside>

      <main class="min-w-0 flex-1 p-4 sm:p-8">
        <div class="mb-6">
          <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600">Dashboard</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-900">{{ config.title }}</h1>
          <p class="mt-2 text-slate-600">Kelola data melalui API Node.js/Express.</p>
        </div>

        <nav class="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button v-for="(item, key) in resources" :key="key" @click="selected = key"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="selected === key ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-indigo-50'">
            {{ item.title }}
          </button>
        </nav>

        <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error }}</div>
        <div v-if="notice" class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{{ notice }}</div>

        <section class="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form class="rounded-xl bg-white p-5 shadow-sm" @submit.prevent="submit">
        <h2 class="mb-5 text-lg font-bold">{{ editingId ? 'Ubah' : 'Tambah' }} {{ config.title }}</h2>
        <div class="space-y-4">
          <label v-for="field in config.fields" :key="field[0]" class="block text-sm font-medium text-slate-700">
            {{ field[1] }}
            <input v-model="form[field[0]]" :type="field[2]" :required="field[0] === 'nama'"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
        </div>
        <div class="mt-6 flex gap-3">
          <button :disabled="saving" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {{ saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah data' }}
          </button>
          <button v-if="editingId" type="button" class="rounded-lg bg-slate-100 px-4 py-2 font-semibold" @click="resetForm">Batal</button>
        </div>
      </form>

      <section class="overflow-hidden rounded-xl bg-white shadow-sm">
        <div class="flex items-center justify-between border-b p-5">
          <h2 class="text-lg font-bold">Data {{ config.title }}</h2>
          <button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold" @click="load">Muat ulang</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500"><tr><th v-for="field in columns" :key="field[0]" class="whitespace-nowrap px-4 py-3">{{ field[1] }}</th><th class="px-4 py-3">Aksi</th></tr></thead>
            <tbody>
              <tr v-if="loading"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500">Memuat data...</td></tr>
              <tr v-else-if="!rows.length"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500">Belum ada data.</td></tr>
              <tr v-for="row in rows" :key="row.id" class="border-t border-slate-100">
                <td v-for="field in columns" :key="field[0]" class="max-w-xs whitespace-normal px-4 py-3">{{ row[field[0]] ?? '-' }}</td>
                <td class="whitespace-nowrap px-4 py-3"><button class="mr-3 font-semibold text-indigo-600" @click="edit(row)">Ubah</button><button class="font-semibold text-red-600" @click="remove(row)">Hapus</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
        </section>
      </main>
    </div>

    <footer class="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500 sm:px-8">
      © {{ new Date().getFullYear() }} DNA Analysis — Vue 3, Tailwind CSS, dan Node.js.
    </footer>
  </div>
</template>
