<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

const resources = {
  korban: {
    title: 'Korban Bencana', endpoint: '/korban-bencana',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['kondisi_kesehatan', 'Kondisi kesehatan', 'text'], ['jenis_bencana', 'Jenis bencana', 'text']
    ], results: [['skor_prioritas', 'Skor prioritas'], ['kategori_prioritas', 'Kategori']]
  },
  penyakit: {
    title: 'Penyakit Genetik', endpoint: '/penyakit-genetik',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['riwayat_penyakit', 'Riwayat penyakit', 'text'], ['jenis_penyakit', 'Jenis penyakit', 'text'], ['input_identifikasi_penyakit_genetik', 'Sekuens DNA (A/C/G/T)', 'text']
    ], results: [['kemungkinan_kelainan_genetik', 'Rasio G'], ['hasil_skrining', 'Hasil skrining']]
  },
  keturunan: {
    title: 'Keturunan', endpoint: '/keturunan',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nama_ayah', 'Nama ayah', 'text'], ['nama_ibu', 'Nama ibu', 'text'], ['pola_pewarisan', 'Pola pewarisan', 'text', 'Autosomal dominan / Autosomal resesif / X-linked recessive'],
      ['jenis_kelamin_anak', 'Jenis kelamin anak', 'text', 'Laki-laki / Perempuan'], ['genotipe_ayah', 'Genotipe ayah', 'text', 'AA/Aa/aa atau XAY/XaY'], ['genotipe_ibu', 'Genotipe ibu', 'text', 'AA/Aa/aa atau XAXA/XAXa/XaXa']
    ], results: [['kemungkinan_normal', 'Normal (%)'], ['kemungkinan_carrier', 'Carrier (%)'], ['kemungkinan_terdampak', 'Terdampak (%)'], ['hasil_punnett', 'Hasil Mendel']]
  },
  pasangan: {
    title: 'Pasangan Hidup', endpoint: '/pasangan-hidup',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['hobi', 'Hobi', 'text'],
      ['pendidikan_terakhir', 'Pendidikan terakhir', 'text'], ['status_hubungan', 'Status hubungan', 'text']
    ], results: [['skor_kecocokan', 'Skor kecocokan'], ['rekomendasi', 'Rekomendasi']]
  },
  penelitian: {
    title: 'Penelitian Ilmiah', endpoint: '/penelitian-ilmiah',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['input_penelitian_ilmiah', 'Judul/data penelitian', 'text'], ['data_x', 'Data X (pisahkan koma)', 'text'], ['data_y', 'Data Y (pisahkan koma)', 'text']
    ], results: [['korelasi', 'Korelasi Pearson'], ['hasil_penelitian', 'Hasil']]
  },
  atletik: {
    title: 'Kinerja Atletik', endpoint: '/peningkatan-kinerja-atletik',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nilai_awal', 'Nilai awal', 'number'], ['nilai_akhir', 'Nilai akhir', 'number']
    ], results: [['peningkatan_kinerja', 'Peningkatan (%)']]
  },
  variant: {
    title: 'Variant Assessment', endpoint: '/variant-assessments',
    minRole: 'admin',
    fields: [
      ['sample_name', 'Nama sampel', 'text'], ['gene', 'Gen', 'text'], ['variant_notation', 'Notasi varian', 'text', 'Contoh: c.123A>G'], ['variant_type', 'Tipe varian', 'text'],
      ['coverage', 'Coverage', 'number'], ['base_quality', 'Base quality', 'number'], ['maf', 'MAF (0-1)', 'number'],
      ['sanger_status', 'Status Sanger', 'text', 'Terkonfirmasi / Tidak terkonfirmasi / Belum diuji'], ['segregation_status', 'Segregasi keluarga', 'text', 'De novo / Cosegregate / Belum diuji'], ['phenotype_match', 'Kecocokan fenotipe', 'text', 'Sesuai / Tidak sesuai / Belum dinilai']
    ], results: [['skor_bukti', 'Skor bukti'], ['status_review', 'Status review'], ['klasifikasi_simulasi', 'Catatan']]
  }
}

const roleHierarchy = { superadmin: 3, admin: 2, user: 1 }

const currentPage = ref('landing')
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
const searchQuery = ref('')
const tablePage = ref(1)
const perPage = ref(10)

const filteredRows = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return rows.value
  return rows.value.filter(row =>
    columns.value.some(([key]) => String(row[key] ?? '').toLowerCase().includes(q))
  )
})
const totalTablePages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage.value)))
const paginatedRows = computed(() => {
  const start = (tablePage.value - 1) * perPage.value
  return filteredRows.value.slice(start, start + perPage.value)
})

const userSearchQuery = ref('')
const userPage = ref(1)
const userPerPage = ref(10)

const filteredUsers = computed(() => {
  const q = userSearchQuery.value.toLowerCase().trim()
  if (!q) return usersList.value
  return usersList.value.filter(u =>
    [u.name, u.email, u.role].some(v => String(v).toLowerCase().includes(q))
  )
})
const totalUserPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / userPerPage.value)))
const paginatedUsers = computed(() => {
  const start = (userPage.value - 1) * userPerPage.value
  return filteredUsers.value.slice(start, start + userPerPage.value)
})

const showAnalysis = ref(false)
const analysisLoading = ref(false)
const analysisRow = ref(null)
const analysisNarrative = ref('')

function generateNarrative(row, moduleKey) {
  const now = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const name = row.nama || row.sample_name || '-'
  const base = `Laporan hasil analisa ini dibuat pada tanggal ${now} oleh Sistem Prediksi DNA Test 54.`

  if (moduleKey === 'korban') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Korban bernama ${row.nama}, berusia ${row.usia} tahun, berjenis kelamin ${row.jenis_kelamin}, mengalami kondisi kesehatan "${row.kondisi_kesehatan}" akibat ${row.jenis_bencana}. Berdasarkan perhitungan otomatis, korban memperoleh skor prioritas ${row.skor_prioritas} dengan kategori "${row.kategori_prioritas}". ${row.keterangan || ''} ${base}`
  }
  if (moduleKey === 'penyakit') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Pasien bernama ${row.nama}, berusia ${row.usia} tahun, berjenis kelamin ${row.jenis_kelamin}. Riwayat penyakit keluarga: ${row.riwayat_penyakit}. Jenis penyakit yang diduga: ${row.jenis_penyakit}. Berdasarkan analisa sekuens DNA, diperoleh rasio basa G sebesar ${(row.kemungkinan_kelainan_genetik * 100).toFixed(2)}%. Hasil skrining: ${row.hasil_skrining}. ${base}`
  }
  if (moduleKey === 'keturunan') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Subjek bernama ${row.nama}, berusia ${row.usia} tahun, berjenis kelamin ${row.jenis_kelamin}. Ayah: ${row.nama_ayah} (${row.genotipe_ayah}), Ibu: ${row.nama_ibu} (${row.genotipe_ibu}). Pola pewarisan: ${row.pola_pewarisan}. Berdasarkan diagram Punnett, probabilitas keturunan: Normal ${row.kemungkinan_normal}%, Carrier ${row.kemungkinan_carrier}%, Terdampak ${row.kemungkinan_terdampak}%. ${row.hasil_punnett || ''} ${base}`
  }
  if (moduleKey === 'pasangan') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Profil ${row.nama}, berusia ${row.umur} tahun. Hobi: ${row.hobi}. Pendidikan terakhir: ${row.pendidikan_terakhir}. Status hubungan: ${row.status_hubungan}. Berdasarkan analisa kompatibilitas genetik, diperoleh skor kecocokan ${row.skor_kecocokan}. Rekomendasi: ${row.rekomendasi}. ${base}`
  }
  if (moduleKey === 'penelitian') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Peneliti ${row.nama}, berusia ${row.usia} tahun, berjenis kelamin ${row.jenis_kelamin}. Judul penelitian: ${row.input_penelitian_ilmiah}. Berdasarkan analisa korelasi Pearson terhadap data X (${row.data_x}) dan data Y (${row.data_y}), diperoleh nilai korelasi sebesar ${row.korelasi?.toFixed(4) || '-'}. ${row.hasil_penelitian || ''} ${base}`
  }
  if (moduleKey === 'atletik') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Atlet ${row.nama}, berusia ${row.usia} tahun, berjenis kelamin ${row.jenis_kelamin}. Nilai awal: ${row.nilai_awal}, Nilai akhir: ${row.nilai_akhir}. Berdasarkan analisa peningkatan kinerja, tercatat peningkatan sebesar ${row.peningkatan_kinerja}% dari performa awal. ${base}`
  }
  if (moduleKey === 'variant') {
    return `Menurut hasil analisa Prediction System DNA Test 54 adalah seperti berikut: Sampel ${row.sample_name} dengan gen ${row.gene} memiliki varian ${row.variant_notation} (${row.variant_type}). Coverage: ${row.coverage}x, Base Quality: ${row.base_quality}, MAF: ${row.maf}. Status Sanger: ${row.sanger_status}. Segregasi keluarga: ${row.segregation_status}. Kecocokan fenotipe: ${row.phenotype_match}. Skor bukti klinis: ${row.skor_bukti}. Status review: ${row.status_review}. ${row.klasifikasi_simulasi || ''} ${base}`
  }
  return base
}

async function startAnalysis(row) {
  analysisRow.value = row
  analysisLoading.value = true
  showAnalysis.value = true
  analysisNarrative.value = ''
  document.getElementById('app')?.scrollTo({ top: 0 })
  await new Promise(r => setTimeout(r, 1500))
  analysisNarrative.value = generateNarrative(row, selected.value)
  analysisLoading.value = false
  await nextTick()
  const el = document.getElementById('qrcode-signature')
  if (el) {
    el.innerHTML = ''
    const data = `DNA-Analysis-54|${row.id || row.nama}|${new Date().toISOString()}`
    QRCode.toCanvas(document.createElement('canvas'), data, { width: 100, margin: 1, color: { dark: '#4f46e5', light: '#ffffff' } }, (err, canvas) => {
      if (!err && el) { el.appendChild(canvas) }
    })
  }
}

function closeAnalysis() {
  showAnalysis.value = false
  analysisRow.value = null
  analysisNarrative.value = ''
}

function printAnalysis() {
  window.print()
}

const canManage = computed(() => currentUser.value && currentUser.value.role === 'superadmin')
const canWrite = computed(() => {
  if (!currentUser.value) return false
  return roleHierarchy[currentUser.value.role] >= roleHierarchy['admin']
})
const visibleResources = computed(() => {
  if (!currentUser.value) return {}
  const userLevel = roleHierarchy[currentUser.value.role] || 0
  const out = {}
  for (const [key, val] of Object.entries(resources)) {
    if (userLevel >= roleHierarchy[val.minRole]) out[key] = val
  }
  return out
})

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
  Swal.fire({
    title: 'Keluar?',
    text: 'Anda akan logout dari sistem.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      token.value = ''
      currentUser.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      currentPage.value = 'landing'
      loginForm.email = ''
      loginForm.password = ''
      selected.value = 'korban'
      Swal.fire({ title: 'Berhasil!', text: 'Anda telah logout.', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  })
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
    const firstKey = Object.keys(visibleResources.value)[0] || 'korban'
    selected.value = firstKey
    currentPage.value = 'dashboard'
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
  currentPage.value = 'dashboard'
  selected.value = key
  searchQuery.value = ''
  tablePage.value = 1
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
    const firstKey = Object.keys(visibleResources.value)[0] || 'korban'
    selected.value = firstKey
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
        <circle cx="24" cy="22" r="2.5" fill="#6366f1"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
        <circle cx="40" cy="22" r="2.5" fill="#818cf8"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/></circle>
        <circle cx="24" cy="42" r="2.5" fill="#818cf8"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/></circle>
        <circle cx="40" cy="42" r="2.5" fill="#6366f1"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
        <circle cx="32" cy="32" r="2" fill="#4f46e5"><animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite"/></circle>
      </svg>
      <p class="text-sm font-semibold text-indigo-600">Memuat data DNA...</p>
    </div>
  </div>

  <!-- LANDING PAGE -->
  <div v-if="currentPage === 'landing'" class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
    <nav class="flex items-center justify-between px-6 py-4 sm:px-12">
      <div class="flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm font-bold text-white text-lg">DNA</div>
        <span class="text-xl font-bold text-white">DNA Analysis</span>
      </div>
      <button @click="currentPage = 'login'" class="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50 transition">Masuk</button>
    </nav>

    <div class="flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
      <div class="grid h-24 w-24 place-items-center rounded-3xl bg-white/15 backdrop-blur-sm font-bold text-white text-4xl mb-8 shadow-2xl">DNA</div>
      <h1 class="text-4xl sm:text-6xl font-extrabold text-white leading-tight max-w-3xl">
        Sistem Manajemen <span class="text-indigo-200">Data Genetik</span>
      </h1>
      <p class="mt-6 max-w-xl text-lg text-indigo-200 leading-relaxed">
        Platform analisis DNA untuk identifikasi korban bencana, penyakit genetik, pola keturunan, penelitian ilmiah, dan assessment varian genetik.
      </p>
      <div class="mt-10 flex gap-4">
        <button @click="currentPage = 'login'" class="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg hover:bg-indigo-50 transition">Mulai Sekarang</button>
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
        <div class="mt-4 flex items-center justify-between">
          <button @click="showForgotPassword = true" class="text-sm text-indigo-600 hover:underline">Lupa password?</button>
          <button @click="currentPage = 'landing'" class="text-sm text-slate-500 hover:underline">&larr; Kembali</button>
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
        <span class="hidden text-xs sm:inline px-2 py-0.5 rounded-full font-medium"
          :class="currentUser?.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : currentUser?.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'">
          {{ currentUser?.role }}
        </span>
        <div class="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{{ currentUser?.name?.charAt(0)?.toUpperCase() || 'A' }}</div>
        <button @click="logout" class="ml-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">Keluar</button>
      </div>
    </header>

    <div class="mx-auto flex max-w-screen-2xl">
      <aside class="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
        <p class="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Menu Data</p>
        <nav class="space-y-1">
          <button v-for="(item, key) in visibleResources" :key="key" @click="switchMenu(key)"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
            :class="selected === key && currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'">
            {{ item.title }}
          </button>
        </nav>

        <template v-if="canManage">
          <p class="mb-3 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Pengaturan</p>
          <nav class="space-y-1">
            <button @click="currentPage = 'users'; loadUsers()"
              class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
              :class="currentPage === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'">
              Manage Users
            </button>
          </nav>
        </template>
      </aside>

      <main class="min-w-0 flex-1 p-4 sm:p-8">
        <!-- MOBILE NAV -->
        <nav class="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button v-for="(item, key) in visibleResources" :key="key" @click="switchMenu(key)"
            class="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition"
            :class="selected === key && currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-indigo-50'">
            {{ item.title }}
          </button>
          <button v-if="canManage" @click="currentPage = 'users'; loadUsers()"
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
            <p class="mt-2 text-slate-600" v-if="canWrite">Kelola data melalui API Node.js/Express.</p>
            <p class="mt-2 text-slate-600" v-else>Menampilkan data (read-only).</p>
          </div>

          <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error }}</div>
          <div v-if="notice" class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{{ notice }}</div>

          <section :class="canWrite ? 'grid gap-6 xl:grid-cols-[380px_1fr]' : ''">
            <!-- FORM (hanya untuk admin & superadmin) -->
            <form v-if="canWrite" class="rounded-xl bg-white p-5 shadow-sm" @submit.prevent="submit">
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
                <div class="flex items-center gap-3">
                  <input v-model="searchQuery" @input="tablePage = 1" type="text" placeholder="Cari data..."
                    class="w-48 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  <button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold" @click="searchQuery = ''; tablePage = 1; load()">Muat ulang</button>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead class="bg-slate-50 text-slate-500">
                    <tr>
                      <th v-for="field in columns" :key="field[0]" class="whitespace-nowrap px-4 py-3">{{ field[1] }}</th>
                      <th v-if="canWrite" class="px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500">Memuat data...</td></tr>
                    <tr v-else-if="!paginatedRows.length"><td :colspan="columns.length + 1" class="p-6 text-center text-slate-500">{{ searchQuery ? 'Data tidak ditemukan.' : 'Belum ada data.' }}</td></tr>
                    <tr v-for="row in paginatedRows" :key="row.id" class="border-t border-slate-100 hover:bg-slate-50">
                      <td v-for="field in columns" :key="field[0]" class="max-w-xs whitespace-normal px-4 py-3">{{ row[field[0]] ?? '-' }}</td>
                      <td v-if="canWrite" class="whitespace-nowrap px-4 py-3">
                        <button class="mr-2 font-semibold text-emerald-600" @click="startAnalysis(row)">Analisa</button>
                        <button class="mr-2 font-semibold text-indigo-600" @click="edit(row)">Ubah</button>
                        <button class="font-semibold text-red-600" @click="remove(row)">Hapus</button>
                      </td>
                      <td v-else class="whitespace-nowrap px-4 py-3">
                        <button class="font-semibold text-emerald-600" @click="startAnalysis(row)">Analisa</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                <span class="text-xs text-slate-500">Menampilkan {{ paginatedRows.length }} dari {{ filteredRows.length }} data</span>
                <div class="flex items-center gap-1">
                  <button :disabled="tablePage <= 1" @click="tablePage--"
                    class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40">&laquo;</button>
                  <template v-for="p in totalTablePages" :key="p">
                    <button v-if="p === tablePage" class="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{{ p }}</button>
                    <button v-else-if="Math.abs(p - tablePage) <= 2 || p === 1 || p === totalTablePages" @click="tablePage = p"
                      class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">{{ p }}</button>
                    <span v-else-if="Math.abs(p - tablePage) === 3" class="px-1 text-xs text-slate-400">...</span>
</template>

<style>
.dna-loader {
  display: flex;
  gap: 16px;
  align-items: center;
}
.strand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #818cf8;
  animation: dna-bounce 0.6s ease-in-out infinite alternate;
}
.strand-right .dot {
  background: #6366f1;
}
@keyframes dna-bounce {
  0% { transform: translateX(-10px) scale(0.8); opacity: 0.5; }
  100% { transform: translateX(10px) scale(1.2); opacity: 1; }
}
@media print {
  .no-print { display: none !important; }
  .dna-loader { display: none !important; }
  body { background: white !important; }
  .print\\:shadow-none { box-shadow: none !important; }
  .print\\:border-0 { border: none !important; }
}
</style>
                  <button :disabled="tablePage >= totalTablePages" @click="tablePage++"
                    class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40">&raquo;</button>
                </div>
              </div>
            </section>
          </section>
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

        <!-- ANALYSIS RESULTS PAGE -->
        <div v-if="showAnalysis && !analysisLoading" class="mx-auto max-w-4xl">
          <div class="mb-6 flex items-center justify-between no-print">
            <button @click="closeAnalysis" class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              &larr; Kembali ke Tabel
            </button>
            <button @click="printAnalysis" class="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Cetak Laporan
            </button>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg print:shadow-none print:border-0">
            <!-- Header -->
            <div class="mb-8 flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <div class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 font-bold text-white text-sm">DNA</div>
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
              <div class="text-center">
                <div id="qrcode-signature" class="mx-auto mb-1 flex items-center justify-center"></div>
                <p class="text-[10px] font-medium text-slate-500">Tanda Tangan Digital</p>
              </div>
              <div class="text-right text-xs text-slate-500">
                <p class="font-semibold text-slate-700 mb-1">{{ currentUser?.name }}</p>
                <p>{{ currentUser?.role }}</p>
                <p>{{ new Date().toLocaleDateString('id-ID') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- MANAGE USERS (hanya superadmin) -->
        <div v-if="currentPage === 'users' && canManage">
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
              <div class="flex items-center gap-3">
                <input v-model="userSearchQuery" @input="userPage = 1" type="text" placeholder="Cari user..."
                  class="w-48 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold" @click="userSearchQuery = ''; userPage = 1; loadUsers()">Muat ulang</button>
              </div>
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
                  <tr v-else-if="!paginatedUsers.length"><td colspan="5" class="p-6 text-center text-slate-500">{{ userSearchQuery ? 'User tidak ditemukan.' : 'Belum ada user.' }}</td></tr>
                  <tr v-for="user in paginatedUsers" :key="user.id" class="border-t border-slate-100 hover:bg-slate-50">
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
            <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
              <span class="text-xs text-slate-500">Menampilkan {{ paginatedUsers.length }} dari {{ filteredUsers.length }} user</span>
              <div class="flex items-center gap-1">
                <button :disabled="userPage <= 1" @click="userPage--"
                  class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40">&laquo;</button>
                <template v-for="p in totalUserPages" :key="p">
                  <button v-if="p === userPage" class="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{{ p }}</button>
                  <button v-else-if="Math.abs(p - userPage) <= 2 || p === 1 || p === totalUserPages" @click="userPage = p"
                    class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">{{ p }}</button>
                  <span v-else-if="Math.abs(p - userPage) === 3" class="px-1 text-xs text-slate-400">...</span>
                </template>
                <button :disabled="userPage >= totalUserPages" @click="userPage++"
                  class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40">&raquo;</button>
              </div>
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
                <input v-model="userForm.password" type="password" :required="!editingUser" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
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
      &copy; {{ new Date().getFullYear() }} DNA Analysis &mdash; Vue 3, Tailwind CSS, dan Node.js.
    </footer>
  </div>
</template>
