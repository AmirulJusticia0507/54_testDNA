const PasanganHidup = require('../models/PasanganHidup');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(PasanganHidup, 'Pasangan hidup', calculators.pasangan);
