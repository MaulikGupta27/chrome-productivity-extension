// models/log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  url: String,
  timeSpent: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
