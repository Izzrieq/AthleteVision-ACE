const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    fullname: String,
    nickname: String,
    dateOfBirth: Date,
    email: { type: String, required: true },
    profilePicture: { data: Buffer, contentType: String },
    role: { type: String, enum: ["player", "coach"], required: true },

    // Shared details
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: String,
    state: String,
    postalcode: String,
    phone: String,
    nric: String,

    // Player-specific
    height: Number,
    weight: Number,
    BMI: Number,
    sportsType: [
      {
        type: String,
        enum: ["Floorball", "Hockey", "Football", "Rugby", "Golf"],
      },
    ],
    position: [
      {
        type: String,
        enum: [
          "Forward",
          "Center",
          "Defense",
          "Goalkeeper",
          "Midfielder",
          "Defender",
          "Back",
          "Hooker",
          "Scrum-half",
          "Point Guard",
          "Shooting Guard",
          "Small Forward",
          "Power Forward",
          "Center",
          "Player",
        ],
      },
    ],

    // Coach-specific
    experienceYears: Number,
    certifications: [String],
    teamsCoached: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
