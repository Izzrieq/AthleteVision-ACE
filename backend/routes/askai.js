// routes/askai.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat route
router.post("/", async (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1].content;

  // Mock fallback if quota exceeded
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ reply: `Mock A.C.E reply to: "${lastMessage}"` });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    const answer = response.choices[0].message.content;
    res.json({ reply: answer });
  } catch (err) {
    console.error(err);
    // fallback mock reply
    res.json({ reply: `⚠️ AI unavailable right now. (Echo: ${lastMessage})` });
  }
});

// Dummy meal route
router.post("/meal", upload.single("mealImage"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Meal image required" });

  try {
    const calories = Math.floor(Math.random() * 500) + 100;
    res.json({ calories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
