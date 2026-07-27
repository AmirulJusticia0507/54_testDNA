const KorbanBencana = require('../models/KorbanBencana');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(KorbanBencana, 'Korban bencana', calculators.korban);
