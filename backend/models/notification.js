const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  from: { type: String, required: true },
  to: [{ type: String }],
  target: { type: String, default: "all" },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
