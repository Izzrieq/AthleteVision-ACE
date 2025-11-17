// routes/workouts.js
const express = require("express");
const router = express.Router();
const Workout = require("../models/workout");

// Get all workouts for a player
router.get("/:userId", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get weekly stats for a player
router.get("/stats/:userId", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    const totalWorkout = workouts.length;
    const hoursTrained = workouts.reduce((sum, w) => sum + w.duration, 0) / 60;
    const caloriesBurned = workouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0
    );
    res.json({ totalWorkout, hoursTrained, caloriesBurned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress for graph (BMI over time example)
router.get("/progress/:userId", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({
      date: 1,
    });
    const progress = workouts.map((w) => w.duration); // or BMI if you track it daily
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:firebaseUid/:workoutType", async (req, res) => {
  try {
    const { firebaseUid, workoutType } = req.params;
    let roadmap = await WorkoutRoadmap.findOne({ firebaseUid, workoutType });

    if (!roadmap) return res.status(404).json(null);

    const today = new Date();
    const lastUpdated = new Date(roadmap.lastUpdated);

    // Reset if not same day
    if (today.toDateString() !== lastUpdated.toDateString()) {
      roadmap.workouts.forEach((w) => (w.completed = false));
      roadmap.lastUpdated = new Date();
      await roadmap.save();
    }

    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch roadmap" });
  }
});

module.exports = router;
