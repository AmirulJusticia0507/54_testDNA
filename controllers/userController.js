const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userController = {};

// Register new user
userController.register = async(req, res) => {
    try {
        // Check if user with the same email already exists
        const emailExist = await User.findOne({ where: { email: req.body.email } });
        if (emailExist) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
userController.login = async(req, res) => {
    try {
        // Check if user with the email exists
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).json({ error: 'Email or password is wrong' });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).json({ error: 'Email or password is wrong' });
        }

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = userController;
