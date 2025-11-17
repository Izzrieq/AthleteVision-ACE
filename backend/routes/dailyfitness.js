const express = require("express");
const router = express.Router();
const DailyFitness = require("../models/dailyfitness");

// ✅ Create or update daily log
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, date, caloriesEaten, caloriesBurned, workoutsDone } =
      req.body;

    if (!firebaseUid || !date) {
      return res
        .status(400)
        .json({ message: "firebaseUid and date are required" });
    }

    const logData = {
      firebaseUid,
      date,
      caloriesEaten,
      caloriesBurned: caloriesBurned || 0,
      workoutsDone: workoutsDone || 0,
    };

    const log = await DailyFitness.findOneAndUpdate(
      { firebaseUid: logData.firebaseUid, date: logData.date },
      logData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(log);
  } catch (err) {
    console.error("❌ Error saving daily fitness:", err);
    res.status(500).json({ message: "Failed to save daily fitness log" });
  }
});

// ✅ Fetch all logs for specific player by firebaseUid
router.get("/user/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const logs = await DailyFitness.find({ firebaseUid }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching daily logs:", err);
    res.status(500).json({ message: "Failed to fetch daily logs" });
  }
});

module.exports = router;
