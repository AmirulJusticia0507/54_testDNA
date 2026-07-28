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
      ['nama_ayah', 'Nama ayah', 'text'], ['nama_ibu', 'Nama ibu', 'text'], ['pola_pewarisan', 'Pola pewarisan', 'text', 'Autosomal dominan / Autosomal resesif / X-linked recessive'],
      ['jenis_kelamin_anak', 'Jenis kelamin anak', 'text', 'Laki-laki / Perempuan'], ['genotipe_ayah', 'Genotipe ayah', 'text', 'AA/Aa/aa atau XAY/XaY'], ['genotipe_ibu', 'Genotipe ibu', 'text', 'AA/Aa/aa atau XAXA/XAXa/XaXa']
    ], results: [['kemungkinan_normal', 'Normal (%)'], ['kemungkinan_carrier', 'Carrier (%)'], ['kemungkinan_terdampak', 'Terdampak (%)'], ['hasil_punnett', 'Hasil Mendel']]
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
  },
  variant: {
    title: 'Variant Assessment', endpoint: '/variant-assessments',
    fields: [
      ['sample_name', 'Nama sampel', 'text'], ['gene', 'Gen', 'text'], ['variant_notation', 'Notasi varian', 'text', 'Contoh: c.123A>G'], ['variant_type', 'Tipe varian', 'text'],
      ['coverage', 'Coverage', 'number'], ['base_quality', 'Base quality', 'number'], ['maf', 'MAF (0–1)', 'number'],
      ['sanger_status', 'Status Sanger', 'text', 'Terkonfirmasi / Tidak terkonfirmasi / Belum diuji'], ['segregation_status', 'Segregasi keluarga', 'text', 'De novo / Cosegregate / Belum diuji'], ['phenotype_match', 'Kecocokan fenotipe', 'text', 'Sesuai / Tidak sesuai / Belum dinilai']
    ], results: [['skor_bukti', 'Skor bukti'], ['status_review', 'Status review'], ['klasifikasi_simulasi', 'Catatan']]
  }
}

const currentPage = ref('login')
const token = ref(localStorage.getItem('token') || '')
const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'))
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
const menuLoading = ref(false)

const loginForm = reactive({ email: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)
const showForgotPassword = ref(false)
const forgotForm = reactive({ email: '' })
const forgotLoading = ref(false)
const forgotMessage = ref('')
const forgotError = ref('')
const resetFormState = reactive({ token: '', password: '', confirmPassword: '' })
const resetLoading = ref(false)
const resetMessage = ref('')
const resetError = ref('')

const usersList = ref([])
const usersLoading = ref(false)
const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = reactive({ name: '', email: '', password: '', role: 'user' })
const userSaving = ref(false)
const userError = ref('')
const userNotice = ref('')

function authHeaders() {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

function setAuth(tokenVal, userVal) {
  token.value = tokenVal
  currentUser.value = userVal
  localStorage.setItem('token', tokenVal)
  localStorage.setItem('user', JSON.stringify(userVal))
}

function logout() {
  token.value = ''
  currentUser.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentPage.value = 'login'
  loginForm.email = ''
  loginForm.password = ''
}

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
  try { return JSON.parse(text) } catch { return { message: `Server mengirim respons tidak valid (${response.status}).` } }
}

async function login() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Login gagal')
    setAuth(data.token, data.user)
    currentPage.value = 'dashboard'
    selected.value = 'korban'
  } catch (err) {
    loginError.value = err.message
  } finally {
    loginLoading.value = false
  }
}

async function forgotPassword() {
  forgotLoading.value = true
  forgotError.value = ''
  forgotMessage.value = ''
  try {
    const response = await fetch('/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotForm.email })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal mengirim token')
    forgotMessage.value = `Token reset: ${data.resetToken}`
  } catch (err) {
    forgotError.value = err.message
  } finally {
    forgotLoading.value = false
  }
}

async function resetPassword() {
  resetLoading.value = true
  resetError.value = ''
  resetMessage.value = ''
  try {
    if (resetFormState.password !== resetFormState.confirmPassword) throw new Error('Password tidak cocok')
    const response = await fetch('/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetFormState.token, password: resetFormState.password })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal reset password')
    resetMessage.value = 'Password berhasil direset. Silakan login.'
    setTimeout(() => { showForgotPassword.value = false }, 2000)
  } catch (err) {
    resetError.value = err.message
  } finally {
    resetLoading.value = false
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
  if (!window.confirm(`Hapus data ${row.nama || row.sample_name || 'ini'}?`)) return
  error.value = ''
  try {
    const response = await fetch(`${config.value.endpoint}/${row.id}`, { method: 'DELETE' })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(messageFrom(data, 'Gagal menghapus data.'))
    notice.value = 'Data berhasil dihapus.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}

async function switchMenu(key) {
  menuLoading.value = true
  selected.value = key
  resetForm()
  await load()
  setTimeout(() => { menuLoading.value = false }, 400)
}

async function loadUsers() {
  usersLoading.value = true
  try {
    const response = await fetch('/users', { headers: authHeaders() })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(messageFrom(data, 'Gagal mengambil data user.'))
    usersList.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    usersLoading.value = false
  }
}

function openCreateUser() {
  editingUser.value = null
  userForm.name = ''
  userForm.email = ''
  userForm.password = ''
  userForm.role = 'user'
  userError.value = ''
  userNotice.value = ''
  showUserModal.value = true
}

function openEditUser(user) {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.password = ''
  userForm.role = user.role
  userError.value = ''
  userNotice.value = ''
  showUserModal.value = true
}

async function saveUser() {
  userSaving.value = true
  userError.value = ''
  userNotice.value = ''
  try {
    const payload = { name: userForm.name, email: userForm.email, role: userForm.role }
    if (userForm.password) payload.password = userForm.password
    const url = editingUser.value ? `/users/${editingUser.value.id}` : '/users/signup'
    const method = editingUser.value ? 'PUT' : 'POST'
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal menyimpan user.')
    userNotice.value = editingUser.value ? 'User berhasil diperbarui.' : 'User berhasil dibuat.'
    await loadUsers()
    setTimeout(() => { showUserModal.value = false }, 1000)
  } catch (err) {
    userError.value = err.message
  } finally {
    userSaving.value = false
  }
}

async function deleteUser(user) {
  if (!window.confirm(`Hapus user ${user.name}?`)) return
  try {
    const response = await fetch(`/users/${user.id}`, { method: 'DELETE', headers: authHeaders() })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal menghapus user.')
    await loadUsers()
  } catch (err) {
    error.value = err.message
  }
}

watch(selected, () => { if (currentPage.value === 'dashboard') { resetForm(); load() } })
onMounted(() => {
  if (token.value && currentUser.value) {
    currentPage.value = 'dashboard'
  }
})
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
        <path d="M32 12 C32 12, 26 20, 26 32 C26 44, 32 52, 32 52 C32 52, 38 44, 38 32 C38 20, 32 12, 32 12Z" stroke="#818cf8" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.2"/>
        <circle cx="24" cy="22" r="2.5" fill="#6366f1">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="22" r="2.5" fill="#818cf8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="24" cy="42" r="2.5" fill="#818cf8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="42" r="2.5" fill="#6366f1">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="32" cy="32" r="2" fill="#4f46e5">
          <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <p class="text-sm font-semibold text-indigo-600">Memuat data DNA...</p>
    </div>
  </div>

  <!-- LOGIN PAGE -->
  <div v-if="currentPage === 'login'" class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-white/20 backdrop-blur-sm font-bold text-white text-2xl mb-4">DNA</div>
        <h1 class="text-3xl font-bold text-white">DNA Analysis</h1>
        <p class="text-indigo-200 mt-2">Sistem manajemen data genetik</p>
      </div>

      <div v-if="!showForgotPassword" class="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Masuk ke akun Anda</h2>
        <div v-if="loginError" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ loginError }}</div>
        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="loginForm.email" type="email" required placeholder="admin@dna.com"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input v-model="loginForm.password" type="password" required placeholder="Masukkan password"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <button :disabled="loginLoading" type="submit"
            class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60">
            {{ loginLoading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>
        <div class="mt-4 text-center">
          <button @click="showForgotPassword = true" class="text-sm text-indigo-600 hover:underline">Lupa password?</button>
        </div>
      </div>

      <!-- FORGOT PASSWORD -->
      <div v-else class="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 class="text-xl font-bold text-slate-900 mb-2">Lupa Password</h2>
        <p class="text-sm text-slate-500 mb-6">Masukkan email untuk mendapatkan token reset password</p>
        <div v-if="forgotError" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ forgotError }}</div>
        <div v-if="forgotMessage" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 break-all">{{ forgotMessage }}</div>
        <form @submit.prevent="forgotPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="forgotForm.email" type="email" required placeholder="admin@dna.com"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <button :disabled="forgotLoading" type="submit"
            class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60">
            {{ forgotLoading ? 'Mengirim...' : 'Kirim Token Reset' }}
          </button>
        </form>

        <div class="mt-6 border-t pt-4">
          <h3 class="text-sm font-semibold text-slate-700 mb-3">Reset Password dengan Token</h3>
          <div v-if="resetError" class="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ resetError }}</div>
          <div v-if="resetMessage" class="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{{ resetMessage }}</div>
          <form @submit.prevent="resetPassword" class="space-y-3">
            <input v-model="resetFormState.token" type="text" required placeholder="Token reset"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <input v-model="resetFormState.password" type="password" required placeholder="Password baru"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <input v-model="resetFormState.confirmPassword" type="password" required placeholder="Konfirmasi password baru"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <button :disabled="resetLoading" type="submit"
              class="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60 text-sm">
              {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
        </div>

        <div class="mt-4 text-center">
          <button @click="showForgotPassword = false" class="text-sm text-indigo-600 hover:underline">Kembali ke login</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MAIN APP -->
  <div v-else class="min-h-screen bg-slate-100">
    <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-8">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 font-bold text-white">DNA</div>
        <div><p class="font-bold text-slate-900">DNA Analysis</p><p class="text-xs text-slate-500">Sistem manajemen data</p></div>
      </div>
      <div class="flex items-center gap-3">
        <span class="hidden text-sm text-slate-500 sm:inline">{{ currentUser?.name }}</span>
        <span class="hidden text-xs text-slate-400 sm:inline px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">{{ currentUser?.role }}</span>
        <div class="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{{ currentUser?.name?.charAt(0)?.toUpperCase() || 'A' }}</div>
        <button @click="logout" class="ml-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">Keluar</button>
      </div>
    </header>

    <div class="mx-auto flex max-w-screen-2xl">
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <p class="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Menu Data</p>
        <nav class="space-y-1">
          <button v-for="(item, key) in resources" :key="key" @click="switchMenu(key)"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
            :class="selected === key && currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'">
            {{ item.title }}
          </button>
        </nav>

        <p class="mb-3 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Pengaturan</p>
        <nav class="space-y-1">
          <button @click="currentPage = 'users'; loadUsers()"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
            :class="currentPage === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'">
            Manage Users
          </button>
        </nav>
      </aside>

      <main class="min-w-0 flex-1 p-4 sm:p-8">
        <!-- MOBILE NAV -->
        <nav class="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button v-for="(item, key) in resources" :key="key" @click="switchMenu(key)"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="selected === key && currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-indigo-50'">
            {{ item.title }}
          </button>
          <button @click="currentPage = 'users'; loadUsers()"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="currentPage === 'users' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-indigo-50'">
            Manage Users
          </button>
        </nav>

        <!-- DASHBOARD -->
        <div v-if="currentPage === 'dashboard'">
          <div class="mb-6">
            <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600">Dashboard</p>
            <h1 class="mt-1 text-3xl font-bold text-slate-900">{{ config.title }}</h1>
            <p class="mt-2 text-slate-600">Kelola data melalui API Node.js/Express.</p>
          </div>

          <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error }}</div>
          <div v-if="notice" class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{{ notice }}</div>

          <section class="grid gap-6 xl:grid-cols-[380px_1fr]">
            <form class="rounded-xl bg-white p-5 shadow-sm" @submit.prevent="submit">
              <h2 class="mb-5 text-lg font-bold">{{ editingId ? 'Ubah' : 'Tambah' }} {{ config.title }}</h2>
              <div class="space-y-4">
                <label v-for="field in config.fields" :key="field[0]" class="block text-sm font-medium text-slate-700">
                  {{ field[1] }}
                  <input v-model="form[field[0]]" :type="field[2]" :placeholder="field[3] || ''" :required="['nama', 'sample_name', 'gene', 'variant_notation'].includes(field[0])"
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
        </div>

        <!-- MANAGE USERS -->
        <div v-if="currentPage === 'users'">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600">Pengaturan</p>
              <h1 class="mt-1 text-3xl font-bold text-slate-900">Manage Users</h1>
              <p class="mt-2 text-slate-600">Kelola akun pengguna sistem.</p>
            </div>
            <button @click="openCreateUser" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition">+ Tambah User</button>
          </div>

          <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error }}</div>

          <section class="overflow-hidden rounded-xl bg-white shadow-sm">
            <div class="flex items-center justify-between border-b p-5">
              <h2 class="text-lg font-bold">Daftar Users</h2>
              <button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold" @click="loadUsers">Muat ulang</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500">
                  <tr>
                    <th class="whitespace-nowrap px-4 py-3">Nama</th>
                    <th class="whitespace-nowrap px-4 py-3">Email</th>
                    <th class="whitespace-nowrap px-4 py-3">Role</th>
                    <th class="whitespace-nowrap px-4 py-3">Dibuat</th>
                    <th class="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="usersLoading"><td colspan="5" class="p-6 text-center text-slate-500">Memuat data...</td></tr>
                  <tr v-else-if="!usersList.length"><td colspan="5" class="p-6 text-center text-slate-500">Belum ada user.</td></tr>
                  <tr v-for="user in usersList" :key="user.id" class="border-t border-slate-100">
                    <td class="px-4 py-3 font-medium">{{ user.name }}</td>
                    <td class="px-4 py-3 text-slate-600">{{ user.email }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        :class="user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-500 text-xs">{{ new Date(user.created_at).toLocaleDateString('id-ID') }}</td>
                    <td class="whitespace-nowrap px-4 py-3">
                      <button class="mr-3 font-semibold text-indigo-600" @click="openEditUser(user)">Ubah</button>
                      <button v-if="user.role !== 'superadmin'" class="font-semibold text-red-600" @click="deleteUser(user)">Hapus</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- USER MODAL -->
        <div v-if="showUserModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showUserModal = false">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 class="mb-4 text-lg font-bold">{{ editingUser ? 'Ubah User' : 'Tambah User Baru' }}</h2>
            <div v-if="userError" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ userError }}</div>
            <div v-if="userNotice" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{{ userNotice }}</div>
            <form @submit.prevent="saveUser" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                <input v-model="userForm.name" type="text" required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input v-model="userForm.email" type="email" required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">{{ editingUser ? 'Password (kosongkan jika tidak diubah)' : 'Password' }}</label>
                <input v-model="userForm.password" :type="'password'" :required="!editingUser" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select v-model="userForm.role" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button :disabled="userSaving" type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
                  {{ userSaving ? 'Menyimpan...' : 'Simpan' }}
                </button>
                <button type="button" class="rounded-lg bg-slate-100 px-4 py-2 font-semibold" @click="showUserModal = false">Batal</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>

    <footer class="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500 sm:px-8">
      © {{ new Date().getFullYear() }} DNA Analysis — Vue 3, Tailwind CSS, dan Node.js.
    </footer>
  </div>
</template>
