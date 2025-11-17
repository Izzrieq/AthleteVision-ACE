const express = require("express");
const router = express.Router();
const PlayerStats = require("../models/playerstat");
const User = require("../models/user");

// Fetch all player stats for a coach using Firebase UID
router.get("/:firebaseUid", async (req, res) => {
  try {
    // Exclude profilePicture for coach
    const coach = await User.findOne(
      { firebaseUid: req.params.firebaseUid },
      { profilePicture: 0 } // exclude
    );

    if (!coach) return res.status(404).json({ message: "Coach not found" });

    // Populate players but exclude profilePicture
    const players = await PlayerStats.find({ coachId: coach._id }).populate(
      "userId",
      "fullname nickname position -_id" // include only required fields
    );

    const formatted = players.map((p) => ({
      _id: p.userId?._id,
      fullname: p.userId?.fullname,
      nickname: p.userId?.nickname,
      position: p.userId?.position,
      stats: {
        agility: p.agility,
        speed: p.speed,
        endurance: p.endurance,
        coordination: p.coordination,
        pass: p.pass,
        shoot: p.shoot,
        dribble: p.dribble,
        control: p.control,
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
