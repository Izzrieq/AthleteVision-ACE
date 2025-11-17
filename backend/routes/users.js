const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ------------------------------
// Upload profile picture
// ------------------------------
router.post(
  "/upload-profile-picture/:userId",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          profilePicture: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "Profile picture updated",
        profilePictureUrl: `/api/users/profile-picture/${user._id}`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ------------------------------
// Get profile picture by userId
// ------------------------------
router.get("/profile-picture/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePicture || !user.profilePicture.data) {
      return res.status(404).send("Profile picture not found");
    }

    res.set("Content-Type", user.profilePicture.contentType);
    res.send(user.profilePicture.data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ------------------------------
// Get all users
// ------------------------------
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from MongoDB
    res.json(users); // return as JSON array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Get user by Firebase UID
// ------------------------------
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Create new user
// ------------------------------
router.post("/", async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    if (!firebaseUid)
      return res.status(400).json({ message: "firebaseUid required" });

    // Check if user exists
    let user = await User.findOne({ firebaseUid });
    if (user) return res.json(user);

    // If not, create new
    user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------------
// Update existing user by Firebase UID
// ------------------------------
router.put("/:firebaseUid", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
