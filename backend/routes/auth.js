const express = require("express");
const User = require("../models/user");
const verifyFirebaseToken = require("../middleware/firebaseAuth");

const router = express.Router();

router.post("/login", verifyFirebaseToken, async (req, res) => {
  try {
    const {
      fullname,
      nickname,
      profilePicture,
      dateOfBirth,
      email,
      role,
      location,
      phone,
      nric,
      height,
      weight,
      sportsType,
      position,
      experienceYears,
      certifications,
      teamsCoached,
    } = req.body;

    let user = await User.findOne({ firebaseUid: req.firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid: req.firebaseUid,
        fullname,
        nickname,
        profilePicture,
        dateOfBirth,
        email,
        role,
        location,
        phone,
        nric,
        height,
        weight,
        BMI:
          height && weight ? (weight / (height / 100) ** 2).toFixed(1) : null,
        sportsType,
        position,
        experienceYears,
        certifications,
        teamsCoached,
      });
    } else {
      // Optional: update details on login
      Object.assign(user, {
        fullname,
        nickname,
        profilePicture,
        dateOfBirth,
        email,
        role,
        location,
        phone,
        nric,
        height,
        weight,
        BMI:
          height && weight ? (weight / (height / 100) ** 2).toFixed(1) : null,
        sportsType,
        position,
        experienceYears,
        certifications,
        teamsCoached,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
