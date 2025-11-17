const express = require("express");
const multer = require("multer");
const Team = require("../models/team");

const router = express.Router();
const upload = multer(); // in-memory storage

// --- GET ALL TEAMS ---
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find();
    const formattedTeams = teams.map((team) => ({
      ...team._doc,
      logoUrl: team.team_logo?.data
        ? `data:${
            team.team_logo.contentType
          };base64,${team.team_logo.data.toString("base64")}`
        : null,
    }));
    res.json(formattedTeams);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// --- GET TEAM BY ID ---
router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const formattedTeam = {
      ...team._doc,
      logoUrl: team.team_logo?.data
        ? `data:${
            team.team_logo.contentType
          };base64,${team.team_logo.data.toString("base64")}`
        : null,
    };

    res.json(formattedTeam);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// --- PLAYER REQUEST TO JOIN ---
router.post("/:id/join", async (req, res) => {
  try {
    const { playerId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const alreadyExists = team.players.find((p) => p.playerId === playerId);
    if (alreadyExists)
      return res.status(400).json({ message: "Already requested or in team" });

    team.players.push({ playerId, status: "pending", role: "player" });
    await team.save();

    res.json({ message: "Join request sent", team });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// --- GET TEAM BY COACH UID ---
router.get("/by-coach/:firebaseuid", async (req, res) => {
  try {
    const team = await Team.findOne({ coachid: req.params.firebaseuid });
    if (!team) return res.status(404).json({ message: "Team not found" });

    const formattedTeam = {
      ...team._doc,
      logoUrl: team.team_logo?.data
        ? `data:${
            team.team_logo.contentType
          };base64,${team.team_logo.data.toString("base64")}`
        : null,
    };

    res.json(formattedTeam);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
