const PeningkatanKinerjaAtletik = require('../models/PeningkatanKinerjaAtletik');
const createCrudController = require('./crudController');
module.exports = createCrudController(PeningkatanKinerjaAtletik, 'Peningkatan kinerja atletik');
