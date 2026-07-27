const VariantAssessment = require('../models/VariantAssessment');
const createCrudController = require('./crudController');
const calculators = require('./calculators');

module.exports = createCrudController(VariantAssessment, 'Variant assessment', calculators.variant);
