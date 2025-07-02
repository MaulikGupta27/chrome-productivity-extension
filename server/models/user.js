const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  blocklist: [String], // array of domain names
});

module.exports = mongoose.model("User", userSchema);
