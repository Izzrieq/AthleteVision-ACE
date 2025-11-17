const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: String, // Example: "09:00 AM"
      required: true,
    },
    description: {
      type: String, // Example: "Jog 5km"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
