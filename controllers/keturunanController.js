const Keturunan = require('../models/Keturunan');

const keturunanController = {};

// Create a new Keturunan
keturunanController.create = async(req, res) => {
    try {
        // Create new Keturunan object
        const keturunan = new Keturunan({
            nama: req.body.nama,
            usia: req.body.usia,
            jenis_kelamin: req.body.jenis_kelamin,
            nama_ayah: req.body.nama_ayah,
            nama_ibu: req.body.nama_ibu,
            nama_pasangan: req.body.nama_pasangan,
            jumlah_anak: req.body.jumlah_anak
        });

        // Save Keturunan to database
        const savedKeturunan = await keturunan.save();

        res.status(201).json({ message: 'Keturunan created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Keturunan
keturunanController.getAll = async(req, res) => {
    try {
        const keturunan = await Keturunan.find();

        res.json(keturunan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Keturunan by ID
keturunanController.getById = async(req, res) => {
    try {
        const keturunan = await Keturunan.findById(req.params.id);

        if (!keturunan) {
            return res.status(404).json({ message: 'Keturunan not found' });
        }

        res.json(keturunan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Keturunan by ID
keturunanController.updateById = async(req, res) => {
    try {
        const keturunan = await Keturunan.findById(req.params.id);

        if (!keturunan) {
            return res.status(404).json({ message: 'Keturunan not found' });
        }

        keturunan.nama = req.body.nama || keturunan.nama;
        keturunan.usia = req.body.usia || keturunan.usia;
        keturunan.jenis_kelamin = req.body.jenis_kelamin || keturunan.jenis_kelamin;
        keturunan.nama_ayah = req.body.nama_ayah || keturunan.nama_ayah;
        keturunan.nama_ibu = req.body.nama_ibu || keturunan.nama_ibu;
        keturunan.nama_pasangan = req.body.nama_pasangan || keturunan.nama_pasangan;
        keturunan.jumlah_anak = req.body.jumlah_anak || keturunan.jumlah_anak;

        // Save updated Keturunan to database
        const savedKeturunan = await keturunan.save();

        res.json({ message: 'Keturunan updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Keturunan by ID
keturunanController.deleteById = async(req, res) => {
    try {
        const keturunan = await Keturunan.findById(req.params.id);

        if (!keturunan) {
            return res.status(404).json({ message: 'Keturunan not found' });
        }

        // Delete Keturunan from database
        await keturunan.remove();

        res.json({ message: 'Keturunan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = keturunanController;