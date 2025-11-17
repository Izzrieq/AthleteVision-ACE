require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const cors = require("cors");
const path = require("path");

// Models
const Fitness = require("./models/fitness");
const DailyFitness = require("./models/dailyfitness");
const Task = require("./models/task");

// Express app
const app = express();

// -------------------- MIDDLEWARE -------------------- //
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files (important fix)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROOT ROUTE -------------------- //
app.get("/", (req, res) => {
  res.json("🏆 Welcome to the CoachVision API");
});

// -------------------- ROUTES -------------------- //

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// User routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Player Stats by Coach routes
const playerstatsByCoachRouter = require("./routes/playerstats-by-coach");
app.use("/api/playerstats-by-coach", playerstatsByCoachRouter);

// Team routes
const teamRoutes = require("./routes/teams");
app.use("/api/teams", teamRoutes);

// Applications routes
const applicationRoutes = require("./routes/applications");
app.use("/api/applications", applicationRoutes);

// Ask AI (legacy)
const askAiRoutes = require("./routes/askai");
app.use("/api/ask-ai", askAiRoutes);

// Fitness routes
const fitnessRoutes = require("./routes/fitness");
app.use("/api/fitness", fitnessRoutes);

// Daily fitness routes
const dailyFitnessRoutes = require("./routes/dailyfitness");
app.use("/api/dailyfitness", dailyFitnessRoutes);

// Calories routes
const caloriesRoutes = require("./routes/calories");
app.use("/api/calories", caloriesRoutes);

// KanBan routes
const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

// Player Stats routes
const playerStatsRoutes = require("./routes/playerstats");
app.use("/api/playerstats", playerStatsRoutes);

// Workout roadmap routes
const workoutRoadmapRoutes = require("./routes/workoutroadmap");
app.use("/api/workoutroadmap", workoutRoadmapRoutes);

// Tactical routes
const tacticalRoutes = require("./routes/tacticals");
app.use("/api/tacticals", tacticalRoutes);

// Match routes
const matchRoutes = require("./routes/matches");
app.use("/api/matches", matchRoutes);

// 🧠 A.C.E Coach Assistant (LLaMA model connection)
const aceAssistantRoutes = require("./routes/ace-assistant");
app.use("/api/ace-assistant", aceAssistantRoutes);

// Notifications routes
const notificationRoutes = require("./routes/notifications");
app.use("/api/notifications", notificationRoutes);

// ---------------------------------------------------- //

// -------------------- CRON JOBS -------------------- //

// ⏰ Push daily fitness data to history and reset counters every midnight + 1 min
cron.schedule("1 0 * * *", async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const fitnessRecords = await Fitness.find({});

    for (let record of fitnessRecords) {
      // Save yesterday's data to DailyFitness collection
      await DailyFitness.create({
        firebaseUid: record.firebaseUid,
        date: yesterday,
        caloriesEaten: record.caloriesConsumed,
        caloriesBurned: record.caloriesBurned,
        workoutsDone: record.totalWorkouts,
      });

      // Reset counters for the next day
      record.caloriesConsumed = 0;
      record.caloriesBurned = 0;
      record.totalWorkouts = 0;
      await record.save();
    }

    console.log("✅ Daily fitness data archived and reset successfully!");
  } catch (err) {
    console.error("❌ Error archiving daily fitness data:", err);
  }
});

// ⏰ Delete tasks older than 24 hours (runs every 30 minutes)
cron.schedule("*/30 * * * *", async () => {
  try {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Delete all tasks where createdAt <= cutoff
    const result = await Task.deleteMany({ createdAt: { $lte: cutoff } });

    console.log(`🗑️ Deleted ${result.deletedCount} tasks older than 24 hours`);
  } catch (err) {
    console.error("❌ Error deleting old tasks:", err);
  }
});

// ⏰ Reset workout completion flags daily at 12:02 AM
cron.schedule("2 0 * * *", async () => {
  try {
    const WorkoutRoadmap = require("./models/workoutroadmaps");

    const result = await WorkoutRoadmap.updateMany(
      {},
      { $set: { "workouts.$[].completed": false, createdAt: new Date() } }
    );

    console.log(
      `✅ WorkoutRoadmaps reset for new day — ${result.modifiedCount} records updated`
    );
  } catch (err) {
    console.error("❌ Error resetting WorkoutRoadmaps:", err);
  }
});

// ---------------------------------------------------- //

// -------------------- DATABASE CONNECTION -------------------- //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `✅ MongoDB connected & server running on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
