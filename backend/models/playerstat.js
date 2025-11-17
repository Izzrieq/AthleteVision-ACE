const mongoose = require("mongoose");

const PlayerStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming coaches are also users
    required: false,
  },
  agility: { type: Number, default: 0 },
  endurance: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  coordination: { type: Number, default: 0 },
  pass: { type: Number, default: 0 },
  shoot: { type: Number, default: 0 },
  dribble: { type: Number, default: 0 },
  control: { type: Number, default: 0 },
  agility_comment: { type: String, default: "" },
  endurance_comment: { type: String, default: "" },
  coordination_comment: { type: String, default: "" },
  speed_comment: { type: String, default: "" },
});

// ✅ Auto add coachName when sending JSON
PlayerStatsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.coachId && ret.coachId.nickname) {
      ret.coachName = ret.coachId.nickname;
    } else {
      ret.coachName = undefined;
    }
    return ret;
  },
});

module.exports = mongoose.model("PlayerStats", PlayerStatsSchema);
