// Import dependencies
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const korbanBencanaRoutes = require('./routes/identifikasiKorbanBencanaRoutes');
const penyakitGenetikRoutes = require('./routes/penyakitGenetikRoutes');
const keturunanRoutes = require('./routes/keturunanRoutes');
const pasanganHidupRoutes = require('./routes/pasanganHidupRoutes');
const penelitianIlmiahRoutes = require('./routes/penelitianIlmiahRoutes');
const peningkatanKinerjaAtletikRoutes = require('./routes/peningkatanKinerjaAtletikRoutes');
const variantAssessmentRoutes = require('./routes/variantAssessmentRoutes');

// Create app instance
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());

// Connect MySQL and create tables when they do not exist.
sequelize.authenticate()
    .then(() => sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' }))
    .then(() => console.log('Connected to MySQL database'))
    .catch((error) => console.error(`MySQL connection error: ${error.message}`));

// Set up routes
app.use('/users', userRoutes);
app.use('/korban-bencana', korbanBencanaRoutes);
app.use('/penyakit-genetik', penyakitGenetikRoutes);
app.use('/keturunan', keturunanRoutes);
app.use('/pasangan-hidup', pasanganHidupRoutes);
app.use('/penelitian-ilmiah', penelitianIlmiahRoutes);
app.use('/peningkatan-kinerja-atletik', peningkatanKinerjaAtletikRoutes);
app.use('/variant-assessments', variantAssessmentRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
