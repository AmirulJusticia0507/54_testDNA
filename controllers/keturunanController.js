const Keturunan = require('../models/Keturunan');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(Keturunan, 'Keturunan', calculators.keturunan);
