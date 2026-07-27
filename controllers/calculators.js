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

function mendelianOutcomes(father, mother) {
  const fatherAlleles = String(father || '').trim();
  const motherAlleles = String(mother || '').trim();
  if (!/^[Aa]{2}$/.test(fatherAlleles) || !/^[Aa]{2}$/.test(motherAlleles)) {
    throw new Error('Genotipe ayah dan ibu harus memakai dua alel A/a, misalnya AA, Aa, atau aa.');
  }
  const results = { AA: 0, Aa: 0, aa: 0 };
  for (const a of fatherAlleles) for (const b of motherAlleles) {
    const child = [a, b].sort((left, right) => (left === 'A' ? -1 : right === 'A' ? 1 : 0)).join('');
    results[child] += 25;
  }
  return results;
}

function xLinkedOutcomes(father, mother, sex) {
  const fatherGenotype = String(father || '').trim();
  const motherGenotype = String(mother || '').trim();
  const childSex = String(sex || '').toLowerCase();
  if (!['laki-laki', 'perempuan'].includes(childSex)) throw new Error('Jenis kelamin anak harus Laki-laki atau Perempuan untuk pola X-linked recessive.');
  if (!['XAY', 'XaY'].includes(fatherGenotype) || !['XAXA', 'XAXa', 'XaXa'].includes(motherGenotype)) {
    throw new Error('Untuk X-linked: ayah harus XAY atau XaY; ibu harus XAXA, XAXa, atau XaXa.');
  }
  const maternalX = motherGenotype === 'XAXA' ? ['XA', 'XA'] : motherGenotype === 'XAXa' ? ['XA', 'Xa'] : ['Xa', 'Xa'];
  const paternal = childSex === 'laki-laki' ? ['Y', 'Y'] : fatherGenotype === 'XAY' ? ['XA', 'XA'] : ['Xa', 'Xa'];
  const results = { normal: 0, carrier: 0, affected: 0 };
  maternalX.forEach((maternal, index) => {
    const paternalPart = paternal[index];
    if (childSex === 'laki-laki') results[maternal === 'Xa' ? 'affected' : 'normal'] += 50;
    else if (maternal === 'Xa' && paternalPart === 'Xa') results.affected += 50;
    else if (maternal === 'Xa' || paternalPart === 'Xa') results.carrier += 50;
    else results.normal += 50;
  });
  return results;
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
    const pattern = data.pola_pewarisan || 'Autosomal resesif';
    if (pattern === 'X-linked recessive') {
      const outcome = xLinkedOutcomes(data.genotipe_ayah, data.genotipe_ibu, data.jenis_kelamin_anak);
      return {
        ...data, kemungkinan_normal: outcome.normal, kemungkinan_carrier: outcome.carrier,
        kemungkinan_terdampak: outcome.affected,
        hasil_punnett: `X-linked recessive: normal ${outcome.normal}%, carrier ${outcome.carrier}%, terdampak ${outcome.affected}%.`
      };
    }
    const outcome = mendelianOutcomes(data.genotipe_ayah, data.genotipe_ibu);
    const affected = pattern === 'Autosomal dominan' ? outcome.AA + outcome.Aa : outcome.aa;
    const carrier = pattern === 'Autosomal resesif' ? outcome.Aa : 0;
    const normal = pattern === 'Autosomal dominan' ? outcome.aa : outcome.AA;
    return {
      ...data, kemungkinan_normal: normal, kemungkinan_carrier: carrier, kemungkinan_terdampak: affected,
      hasil_punnett: `${pattern}: normal ${normal}%, carrier ${carrier}%, terdampak ${affected}%.`
    };
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
  variant(data) {
    const coverage = Number(data.coverage);
    const quality = Number(data.base_quality);
    const maf = Number(data.maf);
    if (!Number.isFinite(coverage) || !Number.isFinite(quality) || !Number.isFinite(maf) || maf < 0 || maf > 1) {
      throw new Error('Coverage, base quality, dan MAF harus berupa angka valid. MAF harus antara 0–1.');
    }
    let score = coverage >= 30 ? 2 : coverage >= 20 ? 1 : -2;
    score += quality >= 30 ? 1 : -1;
    score += maf <= 0.01 ? 1 : -2;
    score += data.sanger_status === 'Terkonfirmasi' ? 3 : data.sanger_status === 'Tidak terkonfirmasi' ? -3 : 0;
    score += data.segregation_status === 'De novo' ? 3 : data.segregation_status === 'Cosegregate' ? 2 : 0;
    score += data.phenotype_match === 'Sesuai' ? 2 : data.phenotype_match === 'Tidak sesuai' ? -2 : 0;
    const status = score >= 7 ? 'Bukti kuat — perlu review klinis' : score >= 3 ? 'Perlu validasi laboratorium' : 'Bukti belum cukup';
    return { ...data, skor_bukti: score, status_review: status, klasifikasi_simulasi: 'Simulasi pendukung; bukan klasifikasi ACMG atau diagnosis klinis.' };
  },
};

module.exports = calculators;
