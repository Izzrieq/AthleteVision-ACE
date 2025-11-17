const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Notification = require("../models/notification");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST new notification
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, message, from, target } = req.body;

    if (!title || !message || !from) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newNotification = new Notification({
      title,
      message,
      from,
      target,
      fileUrl: req.file
        ? `${process.env.API_URL}/uploads/${req.file.filename}`
        : null,
    });

    await newNotification.save();
    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification,
    });
  } catch (err) {
    console.error("Error uploading notification:", err);
    res.status(500).json({ error: "Failed to upload notification" });
  }
});

module.exports = router;
