const PeningkatanKinerjaAtletik = require('../models/PeningkatanKinerjaAtletik');

const peningkatanKinerjaAtletikController = {};

// Get all peningkatan kinerja atletik
peningkatanKinerjaAtletikController.getAll = async(req, res) => {
    try {
        const peningkatanKinerjaAtletik = await PeningkatanKinerjaAtletik.find();
        res.json(peningkatanKinerjaAtletik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get peningkatan kinerja atletik by ID
peningkatanKinerjaAtletikController.getById = async(req, res) => {
    try {
        const peningkatanKinerjaAtletik = await PeningkatanKinerjaAtletik.findById(
            req.params.id
        );

        if (!peningkatanKinerjaAtletik) {
            return res
                .status(404)
                .json({ message: 'Peningkatan kinerja atletik not found' });
        }

        res.json(peningkatanKinerjaAtletik);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new peningkatan kinerja atletik
peningkatanKinerjaAtletikController.create = async(req, res) => {
    try {
        const peningkatanKinerjaAtletik = new PeningkatanKinerjaAtletik(req.body);

        // Save peningkatan kinerja atletik to database
        const savedPeningkatanKinerjaAtletik = await peningkatanKinerjaAtletik.save();

        res.status(201).json({
            message: 'Peningkatan kinerja atletik created successfully',
            data: savedPeningkatanKinerjaAtletik,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update peningkatan kinerja atletik by ID
peningkatanKinerjaAtletikController.updateById = async(req, res) => {
    try {
        const peningkatanKinerjaAtletik = await PeningkatanKinerjaAtletik.findById(
            req.params.id
        );

        if (!peningkatanKinerjaAtletik) {
            return res
                .status(404)
                .json({ message: 'Peningkatan kinerja atletik not found' });
        }

        // Update peningkatan kinerja atletik in database
        await PeningkatanKinerjaAtletik.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        res.json({ message: 'Peningkatan kinerja atletik updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete peningkatan kinerja atletik by ID
peningkatanKinerjaAtletikController.deleteById = async(req, res) => {
    try {
        const peningkatanKinerjaAtletik = await PeningkatanKinerjaAtletik.findById(req.params.id);
        if (!peningkatanKinerjaAtletik) {
            return res.status(404).json({ message: 'Peningkatan kinerja atletik not found' });
        }

        // Delete peningkatan kinerja atletik from database
        await peningkatanKinerjaAtletik.remove();

        res.json({ message: 'Peningkatan kinerja atletik deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = peningkatanKinerjaAtletikController;