const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const korbanBencanaRoutes = require('./routes/identifikasiKorbanBencanaRoutes');
const penyakitGenetikRoutes = require('./routes/penyakitGenetikRoutes');
const keturunanRoutes = require('./routes/keturunanRoutes');
const pasanganHidupRoutes = require('./routes/pasanganHidupRoutes');
const penelitianIlmiahRoutes = require('./routes/penelitianIlmiahRoutes');
const peningkatanKinerjaAtletikRoutes = require('./routes/peningkatanKinerjaAtletikRoutes');
const variantAssessmentRoutes = require('./routes/variantAssessmentRoutes');
const errorHandler = require("./middleware/middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({ status: "OK", service: "DNA Analysis API", version: "1.0.0" });
});

const LoginLog = require('./models/LoginLog');

console.log('Starting server...');
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database')
    })
    .catch((error) => console.error(`MySQL connection error: ${error.message}`));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use('/users', userRoutes);
app.use('/korban-bencana', korbanBencanaRoutes);
app.use('/penyakit-genetik', penyakitGenetikRoutes);
app.use('/keturunan', keturunanRoutes);
app.use('/pasangan-hidup', pasanganHidupRoutes);
app.use('/penelitian-ilmiah', penelitianIlmiahRoutes);
app.use('/peningkatan-kinerja-atletik', peningkatanKinerjaAtletikRoutes);
app.use('/variant-assessments', variantAssessmentRoutes);

const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
