// backend/models/Fitness.js
const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    caloriesEaten: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    workoutsDone: { type: Number, default: 0 },
  },
  { _id: false }
);

const fitnessSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    totalWorkouts: { type: Number, default: 0 },
    hoursTrained: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    caloriesConsumed: { type: Number, default: 0 }, // ✅ new field
    progressPercent: { type: Number, default: 0 },
    height: Number,
    weight: Number,
    BMI: Number,
    history: [dailyLogSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fitness", fitnessSchema);
