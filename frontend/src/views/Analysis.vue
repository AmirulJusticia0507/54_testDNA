<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '../composables/useAppState'

const router = useRouter()
const { auth, analysis } = useAppState()

const { currentUser } = auth
const { analysisRow, analysisNarrative, signatureData,
  closeAnalysis, printAnalysis } = analysis

onMounted(async () => {
  await nextTick()
  const el = document.getElementById('qrcode-signature')
  if (!el || !analysisRow.value) return
  el.innerHTML = ''
  const signer = currentUser.value?.name || 'Unknown'
  const timestamp = new Date().toISOString()
  const reportNo = `DNA-${new Date().getFullYear()}-${String(analysisRow.value.id || 0).padStart(4, '0')}`
  const qrText = `LAPORAN:${reportNo}|PERANGKAT:${signer}|WAKTU:${timestamp}|VERIFIKASI:VALID`
  QRCode.toCanvas(document.createElement('canvas'), qrText, { width: 100, margin: 1, color: { dark: '#4f46e5', light: '#ffffff' } }, (err, canvas) => {
    if (!err && el) { el.appendChild(canvas) }
  })
})

function doClose() {
  closeAnalysis(() => router.push({ name: 'dashboard' }))
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-6 flex items-center justify-between no-print">
      <button @click="doClose" class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
        &larr; Kembali ke Tabel
      </button>
      <button @click="printAnalysis" class="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Cetak Laporan
      </button>
    </div>

    <div v-if="analysisRow" class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg print:shadow-none print:border-0">
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between border-b border-slate-200 pb-6">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10">
              <path d="M12 8C12 8 16 16 16 20C16 24 12 32 12 32" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M28 8C28 8 24 16 24 20C24 24 28 32 28 32" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M12 20H28" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M14 14H26" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
              <path d="M14 26H26" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
              <circle cx="12" cy="8" r="3" fill="#4f46e5"/><circle cx="28" cy="8" r="3" fill="#4f46e5"/>
              <circle cx="12" cy="32" r="3" fill="#4f46e5"/><circle cx="28" cy="32" r="3" fill="#4f46e5"/>
              <circle cx="12" cy="20" r="2.5" fill="#4f46e5" opacity="0.7"/>
              <circle cx="28" cy="20" r="2.5" fill="#4f46e5" opacity="0.7"/>
            </svg>
            <div>
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">LAPORAN HASIL ANALISA DNA</h1>
              <p class="text-xs font-medium text-indigo-600">Sistem Prediksi DNA Test 54</p>
            </div>
          </div>
        </div>
        <div class="text-right text-xs text-slate-500">
          <p class="font-semibold text-slate-700">No. Laporan: DNA-{{ new Date().getFullYear() }}-{{ String(analysisRow?.id || 0).padStart(4, '0') }}</p>
          <p>Tanggal: {{ new Date().toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' }) }}</p>
        </div>
      </div>

      <!-- Narrative -->
      <div class="mb-8">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">Hasil Analisa</h2>
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-6">
          <p class="leading-relaxed text-slate-700 text-justify">{{ analysisNarrative }}</p>
        </div>
      </div>

      <!-- Data Summary Table -->
      <div class="mb-8">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">Ringkasan Data</h2>
        <div class="overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="(val, key) in analysisRow" :key="key" class="border-t border-slate-100">
                <td class="w-2/5 whitespace-nowrap bg-slate-50 px-4 py-2.5 font-semibold text-slate-600">{{ key.replace(/_/g, ' ') }}</td>
                <td class="px-4 py-2.5 text-slate-800">{{ val }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Signature -->
      <div class="flex items-end justify-between border-t border-slate-200 pt-6">
        <div class="text-xs text-slate-500">
          <p class="font-semibold text-slate-700 mb-1">Dikeluarkan oleh:</p>
          <p>DNA Analysis System v1.0</p>
          <p>Sistem Prediksi DNA Test 54</p>
        </div>
        <div class="flex items-end gap-6">
          <div class="text-center">
            <img v-if="signatureData" :src="signatureData" alt="Tanda Tangan" class="mx-auto h-16 rounded border border-slate-200 bg-white" />
            <div v-else class="mx-auto flex h-16 w-32 items-center justify-center rounded border border-dashed border-slate-300 text-[10px] text-slate-400">Tidak ada tanda tangan</div>
            <p class="mt-1 text-[10px] font-medium text-slate-500">Tanda Tangan</p>
          </div>
          <div class="text-center">
            <div id="qrcode-signature" class="mx-auto mb-1 flex items-center justify-center"></div>
            <p class="text-[10px] font-medium text-slate-500">Verifikasi QR</p>
          </div>
        </div>
        <div class="text-right text-xs text-slate-500">
          <p class="font-semibold text-slate-700 mb-1">{{ currentUser?.name }}</p>
            <p>{{ currentUser?.role }}</p>
          <p>{{ new Date().toLocaleDateString('id-ID') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
