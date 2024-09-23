const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exercises: [
      {
        name: String,
        duration: Number,
        caloriesBurned: Number,
      },
    ],
    totalCalories: Number,
    totalTime: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
