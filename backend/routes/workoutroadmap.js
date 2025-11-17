const express = require("express");
const router = express.Router();
const WorkoutRoadmap = require("../models/workoutroadmaps");

// ✅ Create or fetch roadmap safely
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, workoutType, workouts } = req.body;
    if (!firebaseUid || !workoutType || !workouts) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const roadmap = await WorkoutRoadmap.findOneAndUpdate(
      { firebaseUid, workoutType },
      { $setOnInsert: { workouts } },
      { new: true, upsert: true }
    );

    res.status(200).json(roadmap);
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      const existing = await WorkoutRoadmap.findOne({
        firebaseUid,
        workoutType,
      });
      return res.status(200).json(existing);
    }
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get roadmap by user + type
router.get("/:firebaseUid/:workoutType", async (req, res) => {
  try {
    const { firebaseUid, workoutType } = req.params;
    const roadmap = await WorkoutRoadmap.findOne({ firebaseUid, workoutType });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark workout as completed
router.patch("/:firebaseUid/:workoutType/:workoutName", async (req, res) => {
  try {
    const { firebaseUid, workoutType, workoutName } = req.params;

    const roadmap = await WorkoutRoadmap.findOneAndUpdate(
      { firebaseUid, workoutType, "workouts.name": workoutName },
      { $set: { "workouts.$.completed": true } },
      { new: true }
    );

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
