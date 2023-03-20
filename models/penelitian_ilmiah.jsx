// const mongoose = require('mongoose');

// const PenelitianIlmiahSchema = new mongoose.Schema({
//   nama: {
//     type: String,
//     required: true,
//   },
//   usia: {
//     type: Number,
//     required: true,
//   },
//   jenis_kelamin: {
//     type: String,
//     required: true,
//   },
//   input_penelitian_ilmiah: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = mongoose.model('PenelitianIlmiah', PenelitianIlmiahSchema);
const mongoose = require('mongoose');

const PenelitianIlmiahSchema = new mongoose.Schema({
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
  hasil_penelitian: {
    type: String,
    required: true,
  },
});

const PenelitianIlmiah = mongoose.model('PenelitianIlmiah', PenelitianIlmiahSchema);

module.exports = PenelitianIlmiah;
