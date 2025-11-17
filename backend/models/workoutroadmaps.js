const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  name: String,
  sets: String,
  target: String,
  benefit: String,
  steps: [String],
  completed: { type: Boolean, default: false },
});

const WorkoutRoadmapSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true },
  workoutType: { type: String, required: true },
  workouts: [WorkoutSchema],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }, // <-- track last reset
});

// Enforce uniqueness: one roadmap per user + type
WorkoutRoadmapSchema.index(
  { firebaseUid: 1, workoutType: 1 },
  { unique: true }
);

module.exports = mongoose.model("WorkoutRoadmap", WorkoutRoadmapSchema);
