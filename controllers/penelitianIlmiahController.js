const PenelitianIlmiah = require('../models/PenelitianIlmiah');
const createCrudController = require('./crudController');
const calculators = require('./calculators');
module.exports = createCrudController(PenelitianIlmiah, 'Penelitian ilmiah', calculators.penelitian);
