const express = require("express");
const { Ollama } = require("ollama");

const router = express.Router();

// Connect to local Ollama server
const ollama = new Ollama({ host: "YOUR_OLLAMA_HOST_IP" });

// POST /api/ace-assistant
router.post("/", async (req, res) => {
  try {
    const { prompt, teamData, sportType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🧠 Sending prompt to Ollama:", prompt);

    // 🏅 Choose sport context dynamically
    const contextSport = sportType
      ? `You are A.C.E, an advanced AI ${sportType} coach assistant.`
      : "You are A.C.E, an advanced AI multi-sport coach assistant.";

    const response = await ollama.chat({
      model: "llama3.2", // change model if needed (e.g., "llama3.1:70b")
      messages: [
        {
          role: "system",
          content: contextSport,
        },
        {
          role: "user",
          content: `Team data: ${JSON.stringify(
            teamData || {}
          )}\nCoach asks: ${prompt}`,
        },
      ],
    });

    console.log("✅ Ollama response:", response);

    // Extract AI reply safely
    const aiReply =
      response?.message?.content ||
      response?.messages?.[0]?.content ||
      "No response from A.C.E.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ A.C.E Chat Error:", error);
    res
      .status(500)
      .json({ error: error.message || "A.C.E failed to respond." });
  }
});

module.exports = router;
