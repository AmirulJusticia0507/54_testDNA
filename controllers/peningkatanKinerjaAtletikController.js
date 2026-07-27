const PeningkatanKinerjaAtletik = require('../models/PeningkatanKinerjaAtletik');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(PeningkatanKinerjaAtletik, 'Peningkatan kinerja atletik', calculators.atletik);
