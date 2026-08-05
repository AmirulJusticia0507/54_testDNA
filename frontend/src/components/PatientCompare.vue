<script setup>
const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="emit('close')">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-auto p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Perbandingan Data ({{ rows.length }})</h2>
          <button @click="emit('close')" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xl">&times;</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th class="border border-slate-300 dark:border-slate-600 px-3 py-2 bg-slate-50 dark:bg-slate-700 text-left font-semibold text-slate-600 dark:text-slate-300">Field</th>
                <th v-for="(row, i) in rows" :key="row.id" class="border border-slate-300 dark:border-slate-600 px-3 py-2 bg-slate-50 dark:bg-slate-700 text-left font-semibold text-slate-600 dark:text-slate-300">
                  #{{ i + 1 }} — {{ row.nama || row.sample_name || 'Data' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[key, label] in columns" :key="key" class="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td class="border border-slate-300 dark:border-slate-600 px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{{ label }}</td>
                <td v-for="row in rows" :key="row.id + key" class="border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-800 dark:text-slate-200">
                  {{ row[key] ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Teleport>
</template>
