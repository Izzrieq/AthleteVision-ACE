require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// express app
const app = express();

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json("Welcome to the CoachVision API");
});

// ✅ Add Auth Route
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        "DB connected & listening for requests on port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
