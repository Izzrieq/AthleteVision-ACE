const mongoose = require("mongoose");

const playerLineSchema = new mongoose.Schema({
  forward1: String,
  forward2: String,
  center: String,
  defense1: String,
  defense2: String,
  goalkeeper: String,
});

const matchSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  lines: [playerLineSchema],
  score: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Match", matchSchema);
