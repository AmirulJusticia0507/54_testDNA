const PenyakitGenetik = require('../models/PenyakitGenetik');
const createCrudController = require('./crudController');
module.exports = createCrudController(PenyakitGenetik, 'Penyakit genetik');
