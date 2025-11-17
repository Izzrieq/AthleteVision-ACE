const express = require("express");
const router = express.Router();
const Tactical = require("../models/tactical");

// =============================
// GET all tacticals for a user
// If none exist, auto-create a default one
// =============================
router.get("/:firebaseUid", async (req, res) => {
  try {
    let tacticals = await Tactical.find({
      firebaseUid: req.params.firebaseUid,
    });

    // Auto-create if none exist
    if (tacticals.length === 0) {
      const newTactical = new Tactical({
        firebaseUid: req.params.firebaseUid,
        name: "Untitled Tactical",
        pages: [],
      });
      await newTactical.save();
      tacticals = [newTactical];
    }

    res.json(tacticals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// CREATE new tactical
// Body: { firebaseUid: "user123", name: "My Tactical" }
// =============================
router.post("/", async (req, res) => {
  try {
    if (!req.body.firebaseUid) {
      return res.status(400).json({ error: "firebaseUid is required" });
    }

    const newTactical = new Tactical({
      firebaseUid: req.body.firebaseUid,
      name: req.body.name || "Untitled Tactical",
      pages: [{ id: Date.now().toString(), circles: [] }],
    });

    await newTactical.save();
    res.json(newTactical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// ADD a new page to tactical
// Body: { id: "page1", firebaseUid: "user123" }
// =============================
router.post("/:tacticalId/pages", async (req, res) => {
  try {
    const tactical = await Tactical.findOne({
      _id: req.params.tacticalId,
      firebaseUid: req.body.firebaseUid,
    });
    if (!tactical) return res.status(404).json({ error: "Tactical not found" });

    tactical.pages.push({
      id: req.body.id,
      circles: [],
    });

    await tactical.save();
    res.json(tactical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// ADD circle to a page
// Body: { id, color, x, y, pageId, firebaseUid }
// =============================
router.post("/:tacticalId/pages/:pageId/circles", async (req, res) => {
  try {
    const tactical = await Tactical.findOne({
      _id: req.params.tacticalId,
      firebaseUid: req.body.firebaseUid,
    });
    if (!tactical) return res.status(404).json({ error: "Tactical not found" });

    const page = tactical.pages.find((p) => p.id === req.params.pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });

    page.circles.push(req.body);

    await tactical.save();
    res.json(tactical);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// UPDATE a circle (move/change color)
// Body: { x, y, color, firebaseUid }
// =============================
router.put("/:tacticalId/pages/:pageId/circles/:circleId", async (req, res) => {
  try {
    const tactical = await Tactical.findOne({
      _id: req.params.tacticalId,
      firebaseUid: req.body.firebaseUid,
    });
    if (!tactical) return res.status(404).json({ error: "Tactical not found" });

    const page = tactical.pages.find((p) => p.id === req.params.pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });

    const circle = page.circles.find((c) => c.id === req.params.circleId);
    if (!circle) return res.status(404).json({ error: "Circle not found" });

    if (req.body.x !== undefined) circle.x = req.body.x;
    if (req.body.y !== undefined) circle.y = req.body.y;
    if (req.body.color) circle.color = req.body.color;

    await tactical.save();
    res.json(circle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// UPDATE tactical (rename)
// Body: { name: "new name", firebaseUid }
// =============================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Tactical.findOneAndUpdate(
      { _id: req.params.id, firebaseUid: req.body.firebaseUid },
      { name: req.body.name },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Tactical not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DELETE entire tactical
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tactical.findOneAndDelete({
      _id: req.params.id,
      firebaseUid: req.body.firebaseUid, // ✅ ensures only owner can delete
    });

    if (!deleted) {
      return res.status(404).json({ error: "Tactical not found" });
    }

    res.json({ success: true, message: "Tactical deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// DELETE circle
// =============================
router.delete(
  "/:tacticalId/pages/:pageId/circles/:circleId",
  async (req, res) => {
    try {
      const tactical = await Tactical.findOne({
        _id: req.params.tacticalId,
        firebaseUid: req.body.firebaseUid,
      });
      if (!tactical)
        return res.status(404).json({ error: "Tactical not found" });

      const page = tactical.pages.find((p) => p.id === req.params.pageId);
      if (!page) return res.status(404).json({ error: "Page not found" });

      page.circles = page.circles.filter((c) => c.id !== req.params.circleId);

      await tactical.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// =============================
// DELETE page
// =============================
router.delete("/:tacticalId/pages/:pageId", async (req, res) => {
  try {
    const tactical = await Tactical.findOne({
      _id: req.params.tacticalId,
      firebaseUid: req.body.firebaseUid,
    });
    if (!tactical) return res.status(404).json({ error: "Tactical not found" });

    tactical.pages = tactical.pages.filter((p) => p.id !== req.params.pageId);

    await tactical.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
