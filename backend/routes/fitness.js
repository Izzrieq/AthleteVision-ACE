// backend/routes/fitness.js
const express = require("express");
const router = express.Router();
const Fitness = require("../models/fitness");

// GET fitness by firebaseUid
router.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    let fitnessRecords = await Fitness.find({ firebaseUid });

    let fitness;
    if (fitnessRecords.length === 0) {
      fitness = new Fitness({ firebaseUid });
      await fitness.save();
    } else if (fitnessRecords.length === 1) {
      fitness = fitnessRecords[0];
    } else {
      fitness = fitnessRecords[0];
      const duplicates = fitnessRecords.slice(1).map((doc) => doc._id);
      await Fitness.deleteMany({ _id: { $in: duplicates } });
    }

    res.json(fitness);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/fitness/:firebaseUid/increment
router.patch("/:firebaseUid/increment", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { workoutType } = req.body;

    if (!workoutType) {
      return res.status(400).json({ message: "workoutType is required" });
    }

    const fitness = await Fitness.findOneAndUpdate(
      { firebaseUid },
      {
        $inc: { totalWorkouts: 1 },
        $push: { workouts: { type: workoutType, date: new Date() } },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(fitness);
  } catch (err) {
    console.error("Error incrementing workout:", err);
    res.status(500).json({ message: "Failed to increment workout" });
  }
});

// PATCH /api/fitness/:firebaseUid/hours
router.patch("/:firebaseUid/hours", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { hours } = req.body;

    if (hours === undefined || hours === null) {
      return res.status(400).json({ message: "Hours required" });
    }

    const fitness = await Fitness.findOneAndUpdate(
      { firebaseUid },
      { $inc: { totalHours: hours } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(fitness);
  } catch (err) {
    console.error("Failed to add hours:", err);
    res.status(500).json({ message: "Failed to add hours" });
  }
});

// PATCH /api/fitness/:firebaseUid/calories
router.patch("/:firebaseUid/calories", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { calories } = req.body;

    if (calories === undefined || calories === null) {
      return res.status(400).json({ message: "Calories required" });
    }

    const fitness = await Fitness.findOneAndUpdate(
      { firebaseUid },
      { $inc: { caloriesConsumed: calories } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(fitness);
  } catch (err) {
    console.error("Failed to add calories:", err);
    res.status(500).json({ message: "Failed to add calories" });
  }
});

// PUT /api/fitness/:firebaseUid
router.put("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const updates = req.body;

    const fitness = await Fitness.findOneAndUpdate({ firebaseUid }, updates, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json(fitness);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
