const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/dna_analysis_db';

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to database');
}).catch((error) => {
    console.log('Error connecting to database: ', error.message);
});

module.exports = mongoose.connection;