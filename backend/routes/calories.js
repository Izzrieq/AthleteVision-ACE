const express = require("express");
const router = express.Router();
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const fs = require("fs");
const path = require("path");

// ✅ Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Load model once globally
let model;
(async () => {
  console.log("📦 Loading MobileNet model...");
  model = await mobilenet.load();
  console.log("✅ MobileNet model loaded successfully");
})();

// ✅ POST /api/calories
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("📸 Uploaded image:", req.file.path);

    // ✅ Load the image properly for tfjs-node
    const imagePath = path.join(__dirname, "..", req.file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer, 3); // Decode image to tensor

    // ✅ Classify using MobileNet
    const predictions = await model.classify(imageTensor);
    imageTensor.dispose(); // Free memory

    console.log("✅ Predictions:", predictions);

    res.json({
      success: true,
      message: "Image analyzed successfully",
      predictions,
    });
  } catch (err) {
    console.error("❌ TensorFlow Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
