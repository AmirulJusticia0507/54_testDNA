const PenelitianIlmiah = require('../models/PenelitianIlmiah');

const penelitianIlmiahController = {};

// Get all penelitian ilmiah
penelitianIlmiahController.getAll = async(req, res) => {
    try {
        const penelitianIlmiah = await PenelitianIlmiah.find();

        res.json(penelitianIlmiah);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get penelitian ilmiah by ID
penelitianIlmiahController.getById = async(req, res) => {
    try {
        const penelitianIlmiah = await PenelitianIlmiah.findById(req.params.id);

        if (!penelitianIlmiah) {
            return res.status(404).json({ message: 'Penelitian ilmiah not found' });
        }

        res.json(penelitianIlmiah);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new penelitian ilmiah
penelitianIlmiahController.create = async(req, res) => {
    try {
        const penelitianIlmiah = new PenelitianIlmiah({
            judul: req.body.judul,
            penulis: req.body.penulis,
            tahun_terbit: req.body.tahun_terbit,
            penerbit: req.body.penerbit,
            url: req.body.url,
        });

        const savedPenelitianIlmiah = await penelitianIlmiah.save();

        res.status(201).json({ message: 'Penelitian ilmiah created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update penelitian ilmiah by ID
penelitianIlmiahController.updateById = async(req, res) => {
    try {
        const penelitianIlmiah = await PenelitianIlmiah.findById(req.params.id);

        if (!penelitianIlmiah) {
            return res.status(404).json({ message: 'Penelitian ilmiah not found' });
        }

        penelitianIlmiah.judul = req.body.judul || penelitianIlmiah.judul;
        penelitianIlmiah.penulis = req.body.penulis || penelitianIlmiah.penulis;
        penelitianIlmiah.tahun_terbit = req.body.tahun_terbit || penelitianIlmiah.tahun_terbit;
        penelitianIlmiah.penerbit = req.body.penerbit || penelitianIlmiah.penerbit;
        penelitianIlmiah.url = req.body.url || penelitianIlmiah.url;

        const updatedPenelitianIlmiah = await penelitianIlmiah.save();

        res.json({ message: 'Penelitian ilmiah updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete penelitian ilmiah by ID
penelitianIlmiahController.deleteById = async(req, res) => {
    try {
        const penelitianIlmiah = await PenelitianIlmiah.findById(req.params.id);

        if (!penelitianIlmiah) {
            return res.status(404).json({
                message: 'Penelitian ilmiah not found'
            });
        }
        // Delete penelitian ilmiah from database
        await penelitianIlmiah.remove();

        res.json({ message: 'Penelitian ilmiah deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = penelitianIlmiahController;