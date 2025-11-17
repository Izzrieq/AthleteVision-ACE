const express = require("express");
const router = express.Router();
const PlayerStats = require("../models/playerstat");
const User = require("../models/user");
const Team = require("../models/team");

/* ---------------------------------------------
   ✅ Get stats by MongoDB userId
--------------------------------------------- */
router.get("/:userId", async (req, res) => {
  try {
    let stats = await PlayerStats.findOne({
      userId: req.params.userId,
    }).populate("coachId", "nickname");

    if (!stats) {
      stats = await PlayerStats.create({ userId: req.params.userId });
      stats = await PlayerStats.findById(stats._id).populate(
        "coachId",
        "nickname"
      );
    }

    res.json(stats);
  } catch (err) {
    console.error("❌ Error fetching player stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------
   ✅ Get all player stats for a coach’s Mongo ObjectId
--------------------------------------------- */
router.get("/coach/:coachId", async (req, res) => {
  try {
    const players = await PlayerStats.find({ coachId: req.params.coachId })
      .populate("coachId", "nickname")
      .populate("userId", "fullname nickname position");

    res.json(players);
  } catch (err) {
    console.error("❌ Error fetching coach's players:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------
   ✅ NEW: Get all players + stats for a coach by Firebase UID
   🔁 Works exactly like your React `player-stats.tsx`
--------------------------------------------- */
router.get("/team/:firebaseUid", async (req, res) => {
  try {
    // 1️⃣ Find the coach by their Firebase UID
    const coach = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    // 2️⃣ Find the coach’s team
    const team = await Team.findOne({ coachId: coach._id });
    if (!team) return res.status(404).json({ message: "Team not found" });

    // 3️⃣ Loop through each player and get their user info + stats
    const playersData = await Promise.all(
      team.players.map(async (playerRef) => {
        const user = await User.findOne({ firebaseUid: playerRef.firebaseuid });
        if (!user) return null;

        const stats = await PlayerStats.findOne({ userId: user._id });
        return {
          _id: user._id,
          fullname: user.fullname,
          nickname: user.nickname,
          position: user.position || [],
          profilePicture: user.profilePicture,
          stats: stats || null,
        };
      })
    );

    res.json(playersData.filter(Boolean));
  } catch (err) {
    console.error("❌ Error fetching players with stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------------------------
   ✅ Update player stats (by Mongo userId)
--------------------------------------------- */
router.put("/:userId", async (req, res) => {
  try {
    const updateFields = {};

    // Numeric player stat fields
    const statsFields = [
      "agility",
      "endurance",
      "speed",
      "coordination",
      "pass",
      "shoot",
      "dribble",
      "control",
    ];
    statsFields.forEach((field) => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    // Comment fields
    const commentFields = [
      "agility_comment",
      "endurance_comment",
      "coordination_comment",
      "speed_comment",
    ];
    commentFields.forEach((field) => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    // Optional coachId
    if (req.body.coachId !== undefined) updateFields.coachId = req.body.coachId;

    const updated = await PlayerStats.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updateFields },
      { new: true, upsert: true }
    ).populate("coachId", "nickname");

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating player stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
