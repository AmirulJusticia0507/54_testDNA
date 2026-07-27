const PasanganHidup = require('../models/PasanganHidup');
const createCrudController = require('./crudController');
module.exports = createCrudController(PasanganHidup, 'Pasangan hidup');
