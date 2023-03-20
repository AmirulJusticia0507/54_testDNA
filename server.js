// // Import dependencies
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// // Import routes
// const userRoutes = require('./routes/userRoutes');

// // Create app instance
// const app = express();

// // Set up middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.json());

// // Set up database connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// mongoose.connection.on('connected', () => {
//     console.log('Connected to MongoDB database');
// });

// mongoose.connection.on('error', (error) => {
//     console.log(`MongoDB connection error: ${error}`);
// });

// // Set up routes
// app.use('/users', userRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });
// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const korbanBencanaRoutes = require('./routes/korbanBencanaRoutes');
const penyakitGenetikRoutes = require('./routes/penyakitGenetikRoutes');
const keturunanRoutes = require('./routes/keturunanRoutes');
const pasanganHidupRoutes = require('./routes/pasanganHidupRoutes');
const penelitianIlmiahRoutes = require('./routes/penelitianIlmiahRoutes');
const peningkatanKinerjaAtletikRoutes = require('./routes/peningkatanKinerjaAtletikRoutes');

// Create app instance
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Set up database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB database');
});

mongoose.connection.on('error', (error) => {
    console.log(`MongoDB connection error: ${error}`);
});

// Set up routes
app.use('/users', userRoutes);
app.use('/korban-bencana', korbanBencanaRoutes);
app.use('/penyakit-genetik', penyakitGenetikRoutes);
app.use('/keturunan', keturunanRoutes);
app.use('/pasangan-hidup', pasanganHidupRoutes);
app.use('/penelitian-ilmiah', penelitianIlmiahRoutes);
app.use('/peningkatan-kinerja-atletik', peningkatanKinerjaAtletikRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});