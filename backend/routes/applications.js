const express = require("express");
const router = express.Router();
const TeamApplication = require("../models/teamapplication");

// POST /applications
router.post("/", async (req, res) => {
  try {
    const { teamId, playerId } = req.body;

    const exists = await TeamApplication.findOne({ teamId, playerId });
    if (exists) return res.status(400).json({ message: "Already applied" });

    const app = new TeamApplication({ teamId, playerId });
    await app.save();

    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /applications/player/:playerId
router.get("/player/:playerId", async (req, res) => {
  try {
    const apps = await TeamApplication.find({ playerId: req.params.playerId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
