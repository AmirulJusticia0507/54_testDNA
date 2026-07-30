<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '../composables/useAppState'

const router = useRouter()
const { data, analysis } = useAppState()

const { selected, rows, loading, saving, error, notice, editingId, form,
  config, columns, searchQuery, tablePage, perPage,
  filteredRows, totalTablePages, paginatedRows,
  canWrite, resetForm, load, edit, submit, remove, switchMenu } = data

const { startAnalysis } = analysis

function handleAnalysis(row) {
  startAnalysis(row)
}

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
                  <button class="mr-2 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" @click="edit(row)">Ubah</button>
                  <button class="font-semibold text-red-600 hover:text-red-700 dark:text-red-400" @click="remove(row)">Hapus</button>
                </td>
                <td v-else class="whitespace-nowrap px-4 py-3">
                  <button class="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400" @click="handleAnalysis(row)">Analisa</button>
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
  </div>
</template>
