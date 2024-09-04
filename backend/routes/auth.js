const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sesja = require('../sesja/sesja'); // Importowanie middleware z nowego katalogu

const router = express.Router();


router.get('/dashboard', sesja, async (req, res) => {
    try {
        // Pobierz dane użytkownika na podstawie ID z tokenu
        const user = await User.findById(req.user).select('name');
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        res.json({ message: `Witaj na stronie głównej, ${user.name}!` });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
});

// Endpoint do edycji danych użytkownika
router.put('/profile', sesja, async (req, res) => {
    const { name, weight, height } = req.body;

    try {
        // Znajdź użytkownika po ID
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        // Aktualizacja danych użytkownika (poza email)
        user.name = name || user.name;
        user.weight = weight || user.weight;
        user.height = height || user.height;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            weight: updatedUser.weight,
            height: updatedUser.height,
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
});

router.get('/profile', sesja, async (req, res) => {
    try {
        // Pobierz dane użytkownika na podstawie ID z tokenu
        const user = await User.findById(req.user).select('-password'); // Nie zwracaj hasła
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
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

        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '10m' });

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
