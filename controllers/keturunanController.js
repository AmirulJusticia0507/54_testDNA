const Keturunan = require('../models/Keturunan');
const createCrudController = require('./crudController');
module.exports = createCrudController(Keturunan, 'Keturunan');
