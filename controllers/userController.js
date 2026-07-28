const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const userController = {};

// Register new user
userController.register = async (req, res) => {
    try {
        const emailExist = await User.findOne({ where: { email: req.body.email } });
        if (emailExist) {
            return res.status(400).json({ error: 'Email sudah digunakan' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 'user',
        });

        res.status(201).json({ message: 'User berhasil dibuat', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
userController.login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).json({ error: 'Email atau password salah' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Email atau password salah' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
userController.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password', 'token', 'reset_token'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
userController.getById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password', 'token', 'reset_token'] } });
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
userController.update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email;
        if (req.body.role) updates.role = req.body.role;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.update(updates);
        res.json({ message: 'User berhasil diperbarui', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user
userController.delete = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        if (user.role === 'superadmin') return res.status(403).json({ error: 'Tidak dapat menghapus superadmin' });
        await user.destroy();
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Forgot password
userController.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ error: 'Email tidak terdaftar' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiration = new Date(Date.now() + 3600000);

        await user.update({ reset_token: resetToken, reset_token_expiration: resetExpiration });
        res.json({ message: 'Token reset password berhasil dibuat', resetToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reset password
userController.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { reset_token: req.body.token } });
        if (!user) return res.status(400).json({ error: 'Token tidak valid' });
        if (new Date() > user.reset_token_expiration) return res.status(400).json({ error: 'Token sudah kedaluwarsa' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await user.update({ password: hashedPassword, reset_token: null, reset_token_expiration: null });
        res.json({ message: 'Password berhasil direset' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = userController;
