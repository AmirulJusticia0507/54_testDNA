import { computed, reactive, ref, watch } from 'vue'

const resources = {
  korban: {
    title: 'Korban Bencana', endpoint: '/korban-bencana',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['kondisi_kesehatan', 'Kondisi kesehatan', 'text'], ['jenis_bencana', 'Jenis bencana', 'text']
    ], results: [['skor_prioritas', 'Skor prioritas'], ['kategori_prioritas', 'Kategori'], ['external_id', 'External ID']]
  },
  penyakit: {
    title: 'Penyakit Genetik', endpoint: '/penyakit-genetik',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['riwayat_penyakit', 'Riwayat penyakit', 'text'], ['jenis_penyakit', 'Jenis penyakit', 'text'], ['input_identifikasi_penyakit_genetik', 'Sekuens DNA (A/C/G/T)', 'text']
    ], results: [['kemungkinan_kelainan_genetik', 'Rasio G'], ['hasil_skrining', 'Hasil skrining'], ['external_id', 'External ID']]
  },
  keturunan: {
    title: 'Keturunan', endpoint: '/keturunan',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nama_ayah', 'Nama ayah', 'text'], ['nama_ibu', 'Nama ibu', 'text'], ['pola_pewarisan', 'Pola pewarisan', 'text', 'Autosomal dominan / Autosomal resesif / X-linked recessive'],
      ['jenis_kelamin_anak', 'Jenis kelamin anak', 'text', 'Laki-laki / Perempuan'], ['genotipe_ayah', 'Genotipe ayah', 'text', 'AA/Aa/aa atau XAY/XaY'], ['genotipe_ibu', 'Genotipe ibu', 'text', 'AA/Aa/aa atau XAXA/XAXa/XaXa']
    ], results: [['kemungkinan_normal', 'Normal (%)'], ['kemungkinan_carrier', 'Carrier (%)'], ['kemungkinan_terdampak', 'Terdampak (%)'], ['hasil_punnett', 'Hasil Mendel'], ['external_id', 'External ID']]
  },
  pasangan: {
    title: 'Pasangan Hidup', endpoint: '/pasangan-hidup',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['umur', 'Umur', 'number'], ['hobi', 'Hobi', 'text'],
      ['pendidikan_terakhir', 'Pendidikan terakhir', 'text'], ['status_hubungan', 'Status hubungan', 'text']
    ], results: [['skor_kecocokan', 'Skor kecocokan'], ['rekomendasi', 'Rekomendasi'], ['external_id', 'External ID']]
  },
  penelitian: {
    title: 'Penelitian Ilmiah', endpoint: '/penelitian-ilmiah',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['input_penelitian_ilmiah', 'Judul/data penelitian', 'text'], ['data_x', 'Data X (pisahkan koma)', 'text'], ['data_y', 'Data Y (pisahkan koma)', 'text']
    ], results: [['korelasi', 'Korelasi Pearson'], ['hasil_penelitian', 'Hasil'], ['external_id', 'External ID']]
  },
  atletik: {
    title: 'Kinerja Atletik', endpoint: '/peningkatan-kinerja-atletik',
    minRole: 'user',
    fields: [
      ['nama', 'Nama', 'text'], ['usia', 'Usia', 'number'], ['jenis_kelamin', 'Jenis kelamin', 'text'],
      ['nilai_awal', 'Nilai awal', 'number'], ['nilai_akhir', 'Nilai akhir', 'number']
    ], results: [['peningkatan_kinerja', 'Peningkatan (%)'], ['external_id', 'External ID']]
  },
  variant: {
    title: 'Variant Assessment', endpoint: '/variant-assessments',
    minRole: 'admin',
    fields: [
      ['sample_name', 'Nama sampel', 'text'], ['gene', 'Gen', 'text'], ['variant_notation', 'Notasi varian', 'text', 'Contoh: c.123A>G'], ['variant_type', 'Tipe varian', 'text'],
      ['coverage', 'Coverage', 'number'], ['base_quality', 'Base quality', 'number'], ['maf', 'MAF (0-1)', 'number'],
      ['sanger_status', 'Status Sanger', 'text', 'Terkonfirmasi / Tidak terkonfirmasi / Belum diuji'], ['segregation_status', 'Segregasi keluarga', 'text', 'De novo / Cosegregate / Belum diuji'], ['phenotype_match', 'Kecocokan fenotipe', 'text', 'Sesuai / Tidak sesuai / Belum dinilai']
    ], results: [['skor_bukti', 'Skor bukti'], ['status_review', 'Status review'], ['klasifikasi_simulasi', 'Catatan'], ['external_id', 'External ID']]
  }
}

const roleHierarchy = { superadmin: 3, admin: 2, user: 1 }

export function useData(currentUser) {
  const selected = ref('korban')
  const rows = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const notice = ref('')
  const editingId = ref(null)
  const form = reactive({})
  const menuLoading = ref(false)
  const searchQuery = ref('')
  const tablePage = ref(1)
  const perPage = ref(10)

  const config = computed(() => resources[selected.value])
  const columns = computed(() => [...config.value.fields, ...(config.value.results || [])])

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

  function resetForm() {
    editingId.value = null
    Object.keys(form).forEach((key) => delete form[key])
    config.value.fields.forEach(([key]) => { form[key] = '' })
  }

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(config.value.endpoint)
      const data = await response.text()
      const parsed = data ? JSON.parse(data) : {}
      if (!response.ok) throw new Error(parsed?.message || 'Gagal mengambil data.')
      rows.value = parsed
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
      const data = await response.text()
      const parsed = data ? JSON.parse(data) : {}
      if (!response.ok) throw new Error(parsed?.message || 'Gagal menyimpan data.')
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
      const data = await response.text()
      const parsed = data ? JSON.parse(data) : {}
      if (!response.ok) throw new Error(parsed?.message || 'Gagal menghapus data.')
      notice.value = 'Data berhasil dihapus.'
      await load()
    } catch (err) {
      error.value = err.message
    }
  }

  async function switchMenu(key) {
    menuLoading.value = true
    selected.value = key
    searchQuery.value = ''
    tablePage.value = 1
    resetForm()
    await load()
    setTimeout(() => { menuLoading.value = false }, 400)
  }

  watch(selected, () => { resetForm(); load() })

  return {
    resources, roleHierarchy,
    selected, rows, loading, saving, error, notice, editingId, form,
    config, columns, menuLoading, searchQuery, tablePage, perPage,
    filteredRows, totalTablePages, paginatedRows,
    canManage, canWrite, visibleResources,
    resetForm, load, edit, submit, remove, switchMenu
  }
}
