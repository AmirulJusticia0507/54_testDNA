const PenyakitGenetik = require('../models/PenyakitGenetik');

const penyakitGenetikController = {};

// Create new penyakit genetik
penyakitGenetikController.create = async(req, res) => {
    try {
        const penyakitGenetik = new PenyakitGenetik({
            nama: req.body.nama,
            usia: req.body.usia,
            jenis_kelamin: req.body.jenis_kelamin,
            riwayat_penyakit: req.body.riwayat_penyakit,
            jenis_penyakit: req.body.jenis_penyakit,
        });

        // Save penyakit genetik to database
        const savedPenyakitGenetik = await penyakitGenetik.save();

        res.status(201).json({ message: 'Penyakit genetik created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all penyakit genetik
penyakitGenetikController.getAll = async(req, res) => {
    try {
        const penyakitGenetik = await PenyakitGenetik.find();
        res.json(penyakitGenetik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = penyakitGenetikController;