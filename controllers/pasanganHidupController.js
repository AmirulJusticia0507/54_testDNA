const PasanganHidup = require('../models/PasanganHidup');

const pasanganHidupController = {};

// Create new pasangan hidup
pasanganHidupController.create = async(req, res) => {
    try {
        const pasanganHidup = new PasanganHidup(req.body);

        // Save pasangan hidup to database
        const savedPasanganHidup = await pasanganHidup.save();

        res.status(201).json({ message: 'Pasangan hidup created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all pasangan hidup
pasanganHidupController.getAll = async(req, res) => {
    try {
        const pasanganHidup = await PasanganHidup.find();

        res.json(pasanganHidup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pasangan hidup by ID
pasanganHidupController.getById = async(req, res) => {
    try {
        const pasanganHidup = await PasanganHidup.findById(req.params.id);

        if (!pasanganHidup) {
            return res.status(404).json({ message: 'Pasangan hidup not found' });
        }

        res.json(pasanganHidup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update pasangan hidup by ID
pasanganHidupController.updateById = async(req, res) => {
    try {
        const pasanganHidup = await PasanganHidup.findById(req.params.id);

        if (!pasanganHidup) {
            return res.status(404).json({ message: 'Pasangan hidup not found' });
        }

        // Update pasangan hidup
        Object.assign(pasanganHidup, req.body);

        // Save pasangan hidup to database
        const savedPasanganHidup = await pasanganHidup.save();

        res.json({ message: 'Pasangan hidup updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete pasangan hidup by ID
pasanganHidupController.deleteById = async(req, res) => {
    try {
        const pasanganHidup = await PasanganHidup.findById(req.params.id);

        if (!pasanganHidup) {
            return res.status(404).json({ message: 'Pasangan hidup not found' });
        }

        // Delete pasangan hidup from database
        await pasanganHidup.remove();

        res.json({ message: 'Pasangan hidup deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = pasanganHidupController;