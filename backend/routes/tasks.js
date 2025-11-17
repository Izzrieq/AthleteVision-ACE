const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// ------------------------------
// Create new task
// ------------------------------
router.post("/", async (req, res) => {
  try {
    const { userId, time, description } = req.body;

    const task = new Task({ userId, time, description });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------------
// Get all tasks for a user
// ------------------------------
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({
      time: 1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------
// Update task
// ------------------------------
router.put("/:taskId", async (req, res) => {
  try {
    const { time, description } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { time, description },
      { new: true, runValidators: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ------------------------------
// Delete task
// ------------------------------
router.delete("/:taskId", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
