// backend/models/tactical.js
const mongoose = require("mongoose");

const tacticalSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true },
  name: { type: String, required: true },
  pages: [
    {
      id: String,
      circles: [
        {
          id: String,
          color: String,
          x: Number,
          y: Number,
          pageId: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Tactical", tacticalSchema);
