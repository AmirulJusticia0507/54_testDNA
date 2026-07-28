import { nextTick, ref } from 'vue'

function generateNarrative(row, moduleKey) {
  const now = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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

export function useAnalysis(currentUser, selected) {
  const showAnalysis = ref(false)
  const analysisLoading = ref(false)
  const analysisRow = ref(null)
  const analysisNarrative = ref('')
  const showSignatureModal = ref(false)
  const signatureData = ref('')
  const signatureCanvas = ref(null)
  let sigCtx = null
  let sigDrawing = false

  function initSignatureCanvas() {
    nextTick(() => {
      const canvas = signatureCanvas.value
      if (!canvas) return
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      sigCtx = canvas.getContext('2d')
      sigCtx.scale(2, 2)
      sigCtx.fillStyle = '#ffffff'
      sigCtx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      sigCtx.strokeStyle = '#cbd5e1'
      sigCtx.lineWidth = 1
      sigCtx.beginPath()
      sigCtx.moveTo(20, canvas.offsetHeight - 30)
      sigCtx.lineTo(canvas.offsetWidth - 20, canvas.offsetHeight - 30)
      sigCtx.stroke()
      sigCtx.strokeStyle = '#1e293b'
      sigCtx.lineWidth = 2.5
      sigCtx.lineCap = 'round'
      sigCtx.lineJoin = 'round'
    })
  }

  function getSigPos(e) {
    const canvas = signatureCanvas.value
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function sigStart(e) {
    e.preventDefault()
    sigDrawing = true
    const pos = getSigPos(e)
    sigCtx.beginPath()
    sigCtx.moveTo(pos.x, pos.y)
  }

  function sigDraw(e) {
    if (!sigDrawing) return
    e.preventDefault()
    const pos = getSigPos(e)
    sigCtx.lineTo(pos.x, pos.y)
    sigCtx.stroke()
  }

  function sigStop() { sigDrawing = false }

  function clearSignature() {
    const canvas = signatureCanvas.value
    if (!sigCtx || !canvas) return
    sigCtx.fillStyle = '#ffffff'
    sigCtx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    sigCtx.strokeStyle = '#cbd5e1'
    sigCtx.lineWidth = 1
    sigCtx.beginPath()
    sigCtx.moveTo(20, canvas.offsetHeight - 30)
    sigCtx.lineTo(canvas.offsetWidth - 20, canvas.offsetHeight - 30)
    sigCtx.stroke()
    sigCtx.strokeStyle = '#1e293b'
    sigCtx.lineWidth = 2.5
    signatureData.value = ''
  }

  function confirmSignature() {
    const canvas = signatureCanvas.value
    if (!canvas) return
    signatureData.value = canvas.toDataURL('image/png')
    showSignatureModal.value = false
    proceedAnalysis()
  }

  function startAnalysis(row) {
    analysisRow.value = row
    showSignatureModal.value = true
    signatureData.value = ''
    nextTick(() => initSignatureCanvas())
  }

  async function proceedAnalysis(currentPage) {
    const row = analysisRow.value
    analysisLoading.value = true
    if (currentPage) currentPage.value = 'analysis'
    analysisNarrative.value = ''
    document.getElementById('app')?.scrollTo({ top: 0 })
    await new Promise(r => setTimeout(r, 1500))
    analysisNarrative.value = generateNarrative(row, selected.value)
    analysisLoading.value = false
    await nextTick()
    const el = document.getElementById('qrcode-signature')
    if (el) {
      el.innerHTML = ''
      const signer = currentUser.value?.name || 'Unknown'
      const timestamp = new Date().toISOString()
      const reportNo = `DNA-${new Date().getFullYear()}-${String(row.id || 0).padStart(4, '0')}`
      const qrText = `LAPORAN:${reportNo}|PERANGKAT:${signer}|WAKTU:${timestamp}|VERIFIKASI:VALID`
      QRCode.toCanvas(document.createElement('canvas'), qrText, { width: 100, margin: 1, color: { dark: '#4f46e5', light: '#ffffff' } }, (err, canvas) => {
        if (!err && el) { el.appendChild(canvas) }
      })
    }
  }

  function closeAnalysis(currentPage) {
    showAnalysis.value = false
    analysisRow.value = null
    analysisNarrative.value = ''
    if (currentPage) currentPage.value = 'dashboard'
  }

  function printAnalysis() {
    window.print()
  }

  return {
    showAnalysis, analysisLoading, analysisRow, analysisNarrative,
    showSignatureModal, signatureData, signatureCanvas,
    startAnalysis, proceedAnalysis, closeAnalysis, printAnalysis,
    sigStart, sigDraw, sigStop, clearSignature, confirmSignature
  }
}
