const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sesja = require('../sesja/sesja'); // Importowanie middleware z nowego katalogu

const router = express.Router();


router.get('/dashboard', sesja, (req, res) => {
    res.json({ message: `Witaj na stronie głównej, użytkowniku ${req.user}` });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Użytkownik nie istnieje' });
        }

        // Zamiast używać bcrypt, porównaj hasła wprost
        if (password !== user.password) {
            return res.status(400).json({ message: 'Nieprawidłowe hasło' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
});


// Trasa rejestracji
router.post('/register', async (req, res) => {
    const { name, email, password, weight, height } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Użytkownik o takim emailu już istnieje' });
        }

        const user = new User({
            name,
            email,
            password,
            weight,
            height
        });

        const newUser = await user.save();
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            weight: newUser.weight,
            height: newUser.height
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
});

module.exports = router;
