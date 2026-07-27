const PenyakitGenetik = require('../models/PenyakitGenetik');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(PenyakitGenetik, 'Penyakit genetik', calculators.penyakit);
