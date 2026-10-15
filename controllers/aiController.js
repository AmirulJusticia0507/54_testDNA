const aiService = require('../services/aiService');
const VariantAssessment = require('../models/VariantAssessment');
const IdentifikasiPenyakitGenetik = require('../models/PenyakitGenetik');
const IdentifikasiKorbanBencana = require('../models/KorbanBencana');
const Keturunan = require('../models/Keturunan');
const PasanganHidup = require('../models/PasanganHidup');
const PenelitianIlmiah = require('../models/PenelitianIlmiah');
const PeningkatanKinerjaAtletik = require('../models/PeningkatanKinerjaAtletik');

async function analyzeVariant(req, res) {
  try {
    const { id } = req.params;
    const va = await VariantAssessment.findByPk(id);
    if (!va) return res.status(404).json({ error: 'VariantAssessment tidak ditemukan.' });
    const plain = va.toJSON();
    const system = 'Kamu adalah asistem genetika klinis simulasi. Beri interpretasi ringkas dan bertanggung jawab, jangan memberikan diagnosis medis definitif. Jelaskan bukti pendukung berdasar skor_bukti dan status_review yang terhitung sistem. Gunakan bahasa Indonesia yang jelas.';
    const user = `Analisis data VariantAssessment berikut dan berikan ringkasan: ${JSON.stringify(plain, null, 2)}`;
    const result = await aiService.chatCompletion({ system, user });
    res.json({ variant: plain, analysis: result.content, usage: result.usage, model: result.model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function analyzeDiseaseGenetic(req, res) {
  try {
    const { id } = req.params;
    const rec = await IdentifikasiPenyakitGenetik.findByPk(id);
    if (!rec) return res.status(404).json({ error: 'Data identifikasi penyakit genetik tidak ditemukan.' });
    const plain = rec.toJSON();
    const system = 'Kamu adalah analis bioinformatika pendidikan/simulasi. Jelaskan hasil skrining berbasis sekuens secara ringkas dan edukatif. Tekankan ini hanya simulasi, bukan diagnosis medis. Bahasa Indonesia.';
    const user = `Berikan interpretasi hasil identifikasi penyakit genetik (simulasi): ${JSON.stringify(plain, null, 2)}`;
    const result = await aiService.chatCompletion({ system, user });
    res.json({ data: plain, analysis: result.content, usage: result.usage, model: result.model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function chat(req, res) {
  try {
    const { messages, prompt, system } = req.body;
    if (!messages && !prompt) return res.status(400).json({ error: 'messages (array) atau prompt (string) wajib diisi.' });
    const payload = { messages, user: prompt, system };
    const result = await aiService.chatCompletion(payload);
    res.json({ analysis: result.content, usage: result.usage, model: result.model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function image(req, res) {
  try {
    const { prompt, model, size } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt wajib diisi.' });
    const result = await aiService.generateImage({ prompt, model, size });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { analyzeVariant, analyzeDiseaseGenetic, chat, image };