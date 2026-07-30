<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppState } from '../composables/useAppState'
import { useDarkMode } from '../composables/useDarkMode'

const router = useRouter()
const route = useRoute()
const { auth, data, users, analysis } = useAppState()
const { isDark, toggleDark } = useDarkMode()

const { currentUser, token, logout } = auth
const { menuLoading, selected, visibleResources, canManage, canWrite,
  switchMenu } = data
const { loadUsers } = users

const { showSignatureModal, signatureData, signatureCanvas,
  analysisLoading, sigStart, sigDraw, sigStop, clearSignature, confirmSignature } = analysis

const loggingOut = ref(false)

function doLogout() {
  loggingOut.value = true
  token.value = ''
  currentUser.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  setTimeout(() => {
    loggingOut.value = false
    router.push({ name: 'login' })
  }, 1200)
}

function goToDashboard(key) {
  switchMenu(key)
  router.push({ name: 'dashboard' })
}

function goToUsers() {
  loadUsers()
  router.push({ name: 'users' })
}

function goHome() {
  router.push({ name: 'landing' })
  logout({ value: 'landing' }, { value: 'korban' })
}

function doConfirmSignature() {
  confirmSignature(() => router.push({ name: 'analysis' }))
}
</script>

<template>
  <!-- DNA SPINNER -->
  <div v-if="menuLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-3">
      <svg class="h-16 w-16 animate-spin" viewBox="0 0 64 64" fill="none">
        <path d="M32 4 C32 4, 20 16, 20 32 C20 48, 32 60, 32 60 C32 60, 44 48, 44 32 C44 16, 32 4, 32 4Z" stroke="#6366f1" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.3"/>
        <path d="M32 4 C32 4, 20 16, 20 32 C20 48, 32 60, 32 60" stroke="#6366f1" stroke-width="3" stroke-linecap="round" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <circle cx="32" cy="32" r="2" fill="#4f46e5"><animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite"/></circle>
      </svg>
      <p class="text-sm font-semibold text-indigo-600">Memuat data DNA...</p>
    </div>
  </div>

  <div class="min-h-screen bg-slate-100 dark:bg-slate-900">
    <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:px-8">
      <div class="flex items-center gap-3">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-9 w-9">
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
        <div><p class="font-bold text-slate-900 dark:text-slate-100">DNA Analysis</p><p class="text-xs text-slate-500 dark:text-slate-400">Sistem manajemen data</p></div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="toggleDark" class="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition" :title="isDark ? 'Mode gelap' : 'Mode terang'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </button>
        <span class="hidden text-sm text-slate-500 sm:inline dark:text-slate-400">{{ currentUser?.name }}</span>
        <span class="hidden text-xs sm:inline px-2 py-0.5 rounded-full font-medium"
          :class="currentUser?.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : currentUser?.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'">
          {{ currentUser?.role }}
        </span>
        <div class="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 dark:bg-indigo-900 font-semibold text-indigo-700 dark:text-indigo-200">{{ currentUser?.name?.charAt(0)?.toUpperCase() || 'A' }}</div>
        <button @click="doLogout" class="ml-2 rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Keluar</button>
      </div>
    </header>

    <div class="mx-auto flex max-w-screen-2xl">
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 lg:block">
        <p class="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Menu Data</p>
        <nav class="space-y-1">
          <button v-for="(item, key) in visibleResources" :key="key" @click="goToDashboard(key)"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
            :class="selected === key && route.name === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400'">
            {{ item.title }}
          </button>
        </nav>
        <template v-if="canManage">
          <p class="mb-3 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pengaturan</p>
          <nav class="space-y-1">
            <button @click="goToUsers"
              class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
              :class="route.name === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400'">
              Manage Users
            </button>
          </nav>
        </template>
      </aside>

      <main class="min-w-0 flex-1 p-4 sm:p-8">
        <!-- MOBILE NAV -->
        <nav class="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button v-for="(item, key) in visibleResources" :key="key" @click="goToDashboard(key)"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="selected === key && route.name === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'">
            {{ item.title }}
          </button>
          <button v-if="canManage" @click="goToUsers"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="route.name === 'users' ? 'bg-indigo-600 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'">
            Manage Users
          </button>
        </nav>

        <router-view />
      </main>
    </div>

    <!-- SIGNATURE MODAL -->
    <div v-if="showSignatureModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showSignatureModal = false">
      <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Tanda Tangan Digital</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Gambar tanda tangan Anda pada kolom di bawah</p>
          </div>
          <button @click="showSignatureModal = false" class="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
        </div>
        <div class="px-6 py-4">
          <div class="rounded-xl border-2 border-dashed border-slate-300 bg-white p-1">
            <canvas ref="signatureCanvas" class="sig-canvas w-full rounded-lg cursor-crosshair" style="height:180px" @mousedown="sigStart" @mousemove="sigDraw" @mouseup="sigStop" @mouseleave="sigStop" @touchstart="sigStart" @touchmove="sigDraw" @touchend="sigStop"></canvas>
          </div>
          <p class="mt-2 text-center text-xs text-slate-400">Geser jari atau mouse untuk menulis tanda tangan</p>
        </div>
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <button @click="clearSignature" class="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Hapus</button>
          <button @click="doConfirmSignature" class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition">Konfirmasi & Lanjut</button>
        </div>
      </div>
    </div>

    <!-- ANALYSIS LOADING SPINNER -->
    <div v-if="analysisLoading" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div class="dna-loader mb-6">
        <div class="strand strand-left">
          <div v-for="n in 6" :key="'l'+n" class="dot" :style="{ animationDelay: (n * 0.15) + 's' }"></div>
        </div>
        <div class="strand strand-right">
          <div v-for="n in 6" :key="'r'+n" class="dot" :style="{ animationDelay: (n * 0.15 + 0.075) + 's' }"></div>
        </div>
      </div>
      <p class="text-lg font-bold text-indigo-700">Menganalisa data DNA...</p>
      <p class="mt-1 text-sm text-slate-500">Sistem Prediksi DNA Test 54 sedang memproses</p>
    </div>

    <!-- LOGOUT SPINNER -->
    <div v-if="loggingOut" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div class="dna-loader mb-6">
        <div class="strand strand-left">
          <div v-for="n in 6" :key="'l'+n" class="dot" :style="{ animationDelay: (n * 0.15) + 's' }"></div>
        </div>
        <div class="strand strand-right">
          <div v-for="n in 6" :key="'r'+n" class="dot" :style="{ animationDelay: (n * 0.15 + 0.075) + 's' }"></div>
        </div>
      </div>
      <p class="text-lg font-bold text-indigo-700 dark:text-indigo-400">Logout...</p>
      <p class="mt-1 text-sm text-slate-500">Mengakhiri sesi</p>
    </div>

    <footer class="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-5 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-8">
      &copy; {{ new Date().getFullYear() }} DNA Analysis &mdash; Vue 3, Tailwind CSS, dan Node.js.
    </footer>
  </div>
</template>
