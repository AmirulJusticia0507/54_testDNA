<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  title: { type: String, default: '' }
})

const chartType = ref('bar')

const genderData = computed(() => {
  const counts = {}
  const genderCol = props.columns.find(([k]) => k === 'jenis_kelamin' || k === 'gender')
  if (!genderCol) return []
  props.rows.forEach(r => {
    const val = r[genderCol[0]] || 'Tidak diketahui'
    counts[val] = (counts[val] || 0) + 1
  })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})

const ageData = computed(() => {
  const ageCol = props.columns.find(([k]) => k === 'usia' || k === 'umur')
  if (!ageCol) return []
  const ranges = { '0-17': 0, '18-30': 0, '31-45': 0, '46-60': 0, '60+': 0 }
  props.rows.forEach(r => {
    const age = Number(r[ageCol[0]])
    if (isNaN(age)) return
    if (age <= 17) ranges['0-17']++
    else if (age <= 30) ranges['18-30']++
    else if (age <= 45) ranges['31-45']++
    else if (age <= 60) ranges['46-60']++
    else ranges['60+']++
  })
  return Object.entries(ranges).map(([name, count]) => ({ name, count }))
})

const maxCount = computed(() => {
  const all = [...genderData.value.map(d => d.count), ...ageData.value.map(d => d.count)]
  return Math.max(...all, 1)
})

const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e0e7ff']
</script>

<template>
  <div class="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        {{ title || 'Visualisasi Data' }}
      </h3>
      <div class="flex gap-1">
        <button @click="chartType = 'bar'" :class="chartType === 'bar' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'" class="rounded px-2 py-1 text-xs font-semibold transition">Bar</button>
        <button @click="chartType = 'pie'" :class="chartType === 'pie' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'" class="rounded px-2 py-1 text-xs font-semibold transition">Pie</button>
      </div>
    </div>

    <div v-if="!rows.length" class="py-8 text-center text-sm text-slate-400">Tidak ada data untuk divisualisasikan.</div>

    <template v-else>
      <!-- Gender Distribution -->
      <div v-if="genderData.length" class="mb-6">
        <p class="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Distribusi Jenis Kelamin</p>
        <div v-if="chartType === 'bar'" class="space-y-2">
          <div v-for="(d, i) in genderData" :key="d.name" class="flex items-center gap-3">
            <span class="w-24 text-xs text-slate-600 dark:text-slate-300 truncate">{{ d.name }}</span>
            <div class="flex-1 h-6 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: (d.count / maxCount * 100) + '%', backgroundColor: colors[i % colors.length] }"></div>
            </div>
            <span class="w-8 text-right text-xs font-bold text-slate-700 dark:text-slate-200">{{ d.count }}</span>
          </div>
        </div>
        <div v-else class="flex items-center justify-center gap-4">
          <svg viewBox="0 0 100 100" class="w-32 h-32">
            <circle v-for="(d, i) in genderData" :key="i"
              cx="50" cy="50" r="40"
              fill="none" :stroke="colors[i % colors.length]" stroke-width="20"
              :stroke-dasharray="(d.count / rows.length * 251.2) + ' ' + (251.2 - d.count / rows.length * 251.2)"
              :stroke-dashoffset="-genderData.slice(0, i).reduce((sum, x) => sum + x.count / rows.length * 251.2, 0)"
              transform="rotate(-90 50 50)" />
          </svg>
          <div class="space-y-1">
            <div v-for="(d, i) in genderData" :key="d.name" class="flex items-center gap-2 text-xs">
              <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: colors[i % colors.length] }"></div>
              <span class="text-slate-600 dark:text-slate-300">{{ d.name }}: {{ d.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Age Distribution -->
      <div v-if="ageData.length && ageData.some(d => d.count > 0)">
        <p class="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Distribusi Usia</p>
        <div v-if="chartType === 'bar'" class="flex items-end gap-2 h-32">
          <div v-for="(d, i) in ageData" :key="d.name" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">{{ d.count }}</span>
            <div class="w-full rounded-t transition-all duration-500" :style="{ height: (d.count / maxCount * 80) + 'px', backgroundColor: colors[i % colors.length] }"></div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">{{ d.name }}</span>
          </div>
        </div>
        <div v-else class="flex items-center justify-center gap-4">
          <svg viewBox="0 0 100 100" class="w-32 h-32">
            <circle v-for="(d, i) in ageData.filter(d => d.count > 0)" :key="i"
              cx="50" cy="50" r="40"
              fill="none" :stroke="colors[i % colors.length]" stroke-width="20"
              :stroke-dasharray="(d.count / rows.length * 251.2) + ' ' + (251.2 - d.count / rows.length * 251.2)"
              :stroke-dashoffset="-ageData.filter(x => x.count > 0).slice(0, i).reduce((sum, x) => sum + x.count / rows.length * 251.2, 0)"
              transform="rotate(-90 50 50)" />
          </svg>
          <div class="space-y-1">
            <div v-for="(d, i) in ageData.filter(d => d.count > 0)" :key="d.name" class="flex items-center gap-2 text-xs">
              <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: colors[i % colors.length] }"></div>
              <span class="text-slate-600 dark:text-slate-300">{{ d.name }}: {{ d.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
        <span class="text-xs text-slate-500 dark:text-slate-400">Total: <strong class="text-slate-700 dark:text-slate-200">{{ rows.length }}</strong> data</span>
      </div>
    </template>
  </div>
</template>
