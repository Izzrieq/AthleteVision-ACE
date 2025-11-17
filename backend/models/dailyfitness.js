const mongoose = require("mongoose");

const dailyFitnessSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true }, // user ID
    date: { type: Date, required: true }, // which day this log is for
    caloriesEaten: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    workoutsDone: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Each user should only have one log per day
dailyFitnessSchema.index({ firebaseUid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyFitness", dailyFitnessSchema);
