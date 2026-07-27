const KorbanBencana = require('../models/KorbanBencana');
const createCrudController = require('./crudController');
module.exports = createCrudController(KorbanBencana, 'Korban bencana');
