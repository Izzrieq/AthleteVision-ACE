const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Stamina", "Strength", "Agility", "Flexibility"],
      required: true,
    },
    duration: Number, // minutes
    caloriesBurned: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
