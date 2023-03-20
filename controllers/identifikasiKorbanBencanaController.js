const KorbanBencana = require('../models/KorbanBencana');

const korbanBencanaController = {};

// Create new korban bencana
korbanBencanaController.create = async(req, res) => {
    try {
        const korbanBencana = new KorbanBencana({
            nama: req.body.nama,
            usia: req.body.usia,
            jenis_kelamin: req.body.jenis_kelamin,
            alamat: req.body.alamat,
            jenis_bencana: req.body.jenis_bencana,
        });

        // Save korban bencana to database
        const savedKorbanBencana = await korbanBencana.save();

        res.status(201).json({ message: 'Korban bencana created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all korban bencana
korbanBencanaController.getAll = async(req, res) => {
    try {
        const korbanBencana = await KorbanBencana.find();
        res.json(korbanBencana);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = korbanBencanaController;