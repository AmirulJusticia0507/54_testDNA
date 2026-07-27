const PenelitianIlmiah = require('../models/PenelitianIlmiah');
const createCrudController = require('./crudController');
module.exports = createCrudController(PenelitianIlmiah, 'Penelitian ilmiah');
