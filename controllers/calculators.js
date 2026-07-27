function numberList(value, label) {
  const values = String(value || '').split(',').map((item) => Number(item.trim()));
  if (values.length < 2 || values.some((item) => !Number.isFinite(item))) {
    throw new Error(`${label} harus berisi minimal dua angka yang dipisahkan koma.`);
  }
  return values;
}

function calculatePearson(x, y) {
  if (x.length !== y.length) throw new Error('Data X dan Data Y harus memiliki jumlah nilai yang sama.');
  const meanX = x.reduce((sum, value) => sum + value, 0) / x.length;
  const meanY = y.reduce((sum, value) => sum + value, 0) / y.length;
  const numerator = x.reduce((sum, value, index) => sum + ((value - meanX) * (y[index] - meanY)), 0);
  const divisorX = Math.sqrt(x.reduce((sum, value) => sum + ((value - meanX) ** 2), 0));
  const divisorY = Math.sqrt(y.reduce((sum, value) => sum + ((value - meanY) ** 2), 0));
  if (!divisorX || !divisorY) throw new Error('Korelasi tidak dapat dihitung untuk data yang seluruh nilainya sama.');
  return numerator / (divisorX * divisorY);
}

function offspringGenotypes(parentA, parentB) {
  const allelesA = String(parentA || '').trim();
  const allelesB = String(parentB || '').trim();
  if (!/^[Aa]{2}$/.test(allelesA) || !/^[Aa]{2}$/.test(allelesB)) {
    throw new Error('Genotipe ayah dan ibu harus memakai dua alel A/a, misalnya AA, Aa, atau aa.');
  }
  const counts = { AA: 0, Aa: 0, aa: 0 };
  for (const a of allelesA) for (const b of allelesB) {
    const child = [a, b].sort((left, right) => (left === 'A' ? -1 : right === 'A' ? 1 : 0)).join('');
    counts[child] += 1;
  }
  return Object.entries(counts).map(([genotype, count]) => `${genotype}: ${count * 25}%`).join(', ');
}

const calculators = {
  korban(data) {
    const age = Number(data.umur ?? data.usia);
    let score = 0;
    if (Number.isFinite(age) && (age < 5 || age > 65)) score += 30;
    const severity = { Kritis: 70, Sedang: 40, Ringan: 15, Sehat: 0 }[data.kondisi_kesehatan] ?? 0;
    score += severity;
    const category = score >= 70 ? 'Prioritas tinggi' : score >= 40 ? 'Prioritas sedang' : 'Prioritas rendah';
    return { ...data, skor_prioritas: score, kategori_prioritas: category, keterangan: `${category} (skor ${score}/100).` };
  },
  penyakit(data) {
    const sequence = String(data.input_identifikasi_penyakit_genetik || '').toUpperCase().replace(/\s/g, '');
    if (!/^[ACGT]+$/.test(sequence)) throw new Error('Sekuens DNA hanya boleh berisi A, C, G, dan T.');
    const mutationCount = [...sequence].filter((base) => base === 'G').length;
    const probability = mutationCount / sequence.length;
    return { ...data, input_identifikasi_penyakit_genetik: sequence, kemungkinan_kelainan_genetik: probability, hasil_skrining: `Simulasi: ${mutationCount} dari ${sequence.length} basa adalah G (${(probability * 100).toFixed(2)}%). Bukan diagnosis medis.` };
  },
  keturunan(data) {
    return { ...data, hasil_punnett: offspringGenotypes(data.genotipe_ayah, data.genotipe_ibu) };
  },
  pasangan(data) {
    const age = Number(data.umur ?? data.usia);
    let score = Number.isFinite(age) && age >= 18 && age <= 30 ? 30 : 0;
    if (['musik', 'olahraga'].includes(String(data.hobi || '').toLowerCase())) score += 25;
    if (['S1', 'S2', 'S3'].includes(data.pendidikan_terakhir)) score += 25;
    if (data.status_hubungan === 'Single') score += 20;
    return { ...data, skor_kecocokan: score, rekomendasi: score >= 70 ? 'Profil cocok untuk rekomendasi awal.' : 'Profil belum memenuhi skor rekomendasi awal.' };
  },
  penelitian(data) {
    const x = numberList(data.data_x, 'Data X');
    const y = numberList(data.data_y, 'Data Y');
    const correlation = calculatePearson(x, y);
    return { ...data, korelasi: correlation, hasil_penelitian: `Korelasi Pearson: ${correlation.toFixed(4)}` };
  },
  atletik(data) {
    const initial = Number(data.nilai_awal);
    const final = Number(data.nilai_akhir);
    if (!Number.isFinite(initial) || !Number.isFinite(final) || initial === 0) throw new Error('Nilai awal harus berupa angka dan tidak boleh 0.');
    return { ...data, peningkatan_kinerja: (((final - initial) / initial) * 100).toFixed(2) };
  },
};

module.exports = calculators;
