// routes/matches.js
const express = require("express");
const Match = require("../models/match");

const router = express.Router();

// Create a new match
router.post("/", async (req, res) => {
  try {
    const { teamId, name, date, lines, score } = req.body;
    const match = new Match({ teamId, name, date, lines, score });
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving match", error });
  }
});

// Get all matches by team
router.get("/team/:teamId", async (req, res) => {
  try {
    const matches = await Match.find({ teamId: req.params.teamId });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches", error });
  }
});

module.exports = router;
