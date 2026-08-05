<script setup>
import { ref, onMounted } from 'vue'

const stats = ref(null)
const loading = ref(false)
const error = ref(null)

async function loadStats() {
  loading.value = true
  error.value = null
  try {
    const endpoints = [
      { name: 'Korban Bencana', url: '/korban-bencana' },
      { name: 'Penyakit Genetik', url: '/penyakit-genetik' },
      { name: 'Keturunan', url: '/keturunan' },
      { name: 'Pasangan Hidup', url: '/pasangan-hidup' },
      { name: 'Penelitian Ilmiah', url: '/penelitian-ilmiah' },
      { name: 'Kinerja Atletik', url: '/peningkatan-kinerja-atletik' },
      { name: 'Variant Assessment', url: '/variant-assessments' },
    ]

    const results = []
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url)
        const data = await res.json()
        results.push({ name: ep.name, count: Array.isArray(data) ? data.length : 0 })
      } catch {
        results.push({ name: ep.name, count: 0 })
      }
    }
    stats.value = results
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)

const maxCount = ref(0)
const barColor = (count) => {
  if (!maxCount.value) return 'w-0'
  return `w-[${Math.round((count / maxCount.value) * 100)}%]`
}
</script>

<template>
  <div class="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h2>
      <button @click="loadStats" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Muat Ulang</button>
    </div>

    <div v-if="loading" class="text-center py-8 text-slate-500 text-sm">Memuat statistik...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500 text-sm">{{ error }}</div>
    <div v-else-if="stats" class="space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span>Total Data</span>
        <span>{{ stats.reduce((a, b) => a + b.count, 0) }} records</span>
      </div>
      <div v-for="item in stats" :key="item.name" class="flex items-center gap-3">
        <span class="w-36 text-xs text-slate-600 dark:text-slate-300 text-right truncate">{{ item.name }}</span>
        <div class="flex-1 bg-slate-100 dark:bg-slate-700 rounded h-5 overflow-hidden">
          <div class="bg-indigo-500 h-full rounded transition-all duration-500" :style="{ width: `${item.count ? Math.max(4, (item.count / Math.max(...stats.map(s => s.count), 1)) * 100) : 0}%` }" />
        </div>
        <span class="w-10 text-right text-xs font-bold text-slate-800 dark:text-slate-200">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>
