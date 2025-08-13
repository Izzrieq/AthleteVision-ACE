// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    fullname: String,
    nickname: String,
    profilePicture: String,
    dateOfBirth: Date,
    email: { type: String, required: true },
    role: { type: String, enum: ["player", "coach"], required: true },

    // Shared details
    location: String,
    phone: String,
    nric: String,

    // Player-specific
    height: Number,
    weight: Number,
    BMI: Number,
    sportsType: {
      type: String,
      enum: ["floorball", "football", "basketball", "hockey"],
    },
    position: String,

    // Coach-specific
    experienceYears: Number,
    certifications: [String],
    teamsCoached: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
