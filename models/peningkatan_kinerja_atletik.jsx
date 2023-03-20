const mongoose = require('mongoose');

const PeningkatanKinerjaAtletikSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  usia: {
    type: Number,
    required: true,
  },
  jenis_kelamin: {
    type: String,
    required: true,
  },
  nilai_awal: {
    type: Number,
    required: true,
  },
  nilai_akhir: {
    type: Number,
    required: true,
  },
  peningkatan_kinerja: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('PeningkatanKinerjaAtletik', PeningkatanKinerjaAtletikSchema);
