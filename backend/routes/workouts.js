const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const sesja = require('../sesja/sesja');

// Dodanie nowego treningu
router.post('/', sesja, async (req, res) => {
  const { exercises, totalCalories, totalTime } = req.body;

  try {
    const workout = new Workout({
      user: req.user,
      exercises,
      totalCalories,
      totalTime,
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});

// Pobranie treningów użytkownika
router.get('/', sesja, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});

module.exports = router;
