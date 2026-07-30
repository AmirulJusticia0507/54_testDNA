<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
    <nav class="flex items-center justify-between px-6 py-4 sm:px-12">
      <div class="flex items-center gap-3">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white">
          <path d="M12 8C12 8 16 16 16 20C16 24 12 32 12 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M28 8C28 8 24 16 24 20C24 24 28 32 28 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M12 20H28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M14 14H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <path d="M14 26H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <circle cx="12" cy="8" r="3" fill="currentColor"/><circle cx="28" cy="8" r="3" fill="currentColor"/>
          <circle cx="12" cy="32" r="3" fill="currentColor"/><circle cx="28" cy="32" r="3" fill="currentColor"/>
          <circle cx="12" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
          <circle cx="28" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
        </svg>
        <span class="text-xl font-bold text-white">DNA Analysis</span>
      </div>
      <button @click="router.push({ name: 'login' })" class="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50 transition">Masuk</button>
    </nav>

    <div class="flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-indigo-200 mb-8">
        <path d="M18 12C18 12 24 24 24 30C24 36 18 48 18 48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M42 12C42 12 36 24 36 30C36 36 42 48 42 48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M18 30H42" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M21 21H39" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <path d="M21 39H39" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <circle cx="18" cy="12" r="5" fill="currentColor"/><circle cx="42" cy="12" r="5" fill="currentColor"/>
        <circle cx="18" cy="48" r="5" fill="currentColor"/><circle cx="42" cy="48" r="5" fill="currentColor"/>
        <circle cx="18" cy="30" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="42" cy="30" r="4" fill="currentColor" opacity="0.7"/>
      </svg>
      <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-tight max-w-3xl">
        Sistem Manajemen <span class="text-indigo-200">Data Genetik</span>
      </h1>
      <p class="mt-6 max-w-xl text-lg text-indigo-200 leading-relaxed">
        Platform analisis DNA untuk identifikasi korban bencana, penyakit genetik, pola keturunan, penelitian ilmiah, dan assessment varian genetik.
      </p>
      <div class="mt-10 flex gap-4">
        <button @click="router.push({ name: 'login' })" class="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg hover:bg-indigo-50 transition">Mulai Sekarang</button>
        <a href="#fitur" class="rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-bold text-white hover:bg-white/10 transition">Pelajari Lebih Lanjut</a>
      </div>

      <div id="fitur" class="mt-24 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">🧬</div>
          <h3 class="text-lg font-bold text-white">Penyakit Genetik</h3>
          <p class="mt-2 text-sm text-indigo-200">Identifikasi kemungkinan kelainan genetik dari sekuens DNA.</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 class="text-lg font-bold text-white">Analisis Keturunan</h3>
          <p class="mt-2 text-sm text-indigo-200">Simulasi pewarisan genetik dengan diagram Punnett.</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">🚨</div>
          <h3 class="text-lg font-bold text-white">Korban Bencana</h3>
          <p class="mt-2 text-sm text-indigo-200">Sistem prioritas berbasis DNA untuk identifikasi korban.</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">🔬</div>
          <h3 class="text-lg font-bold text-white">Penelitian Ilmiah</h3>
          <p class="mt-2 text-sm text-indigo-200">Analisis korelasi Pearson untuk data genetik.</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">🏃</div>
          <h3 class="text-lg font-bold text-white">Kinerja Atletik</h3>
          <p class="mt-2 text-sm text-indigo-200">Tracking peningkatan performa berbasis data genetik.</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
          <div class="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/30 text-2xl mb-4">🧪</div>
          <h3 class="text-lg font-bold text-white">Variant Assessment</h3>
          <p class="mt-2 text-sm text-indigo-200">Evaluasi varian genetik dengan skor bukti klinis.</p>
        </div>
      </div>
    </div>

    <footer class="border-t border-white/10 px-6 py-6 text-center text-sm text-indigo-300">
      &copy; {{ new Date().getFullYear() }} DNA Analysis &mdash; Vue 3, Tailwind CSS, dan Node.js.
    </footer>
  </div>
</template>
