const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    firebaseuid: { type: String, required: true },
    team_logo: {
      data: Buffer,
      contentType: String,
    },
    team_name: { type: String, required: true },
    coachid: { type: String, required: true },
    players: [
      {
        playerId: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "approved"],
          default: "pending",
        },
        role: {
          type: String,
          enum: ["captain", "player", "assistant coach"],
          default: "player",
        },
      },
    ],
    sportstype: {
      type: String,
      enum: ["floorball", "rugby", "basketball"],
      required: true,
    },
    achievements: { type: Number, default: 0 },
    notes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Team || mongoose.model("Team", TeamSchema);
