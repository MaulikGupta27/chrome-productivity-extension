// server/controllers/userController.js
const User = require("../models/user"); // Your user model

// GET blocklist
exports.getBlockList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user from requireAuth
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ blocklist: user.blocklist || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST blocklist (update)
exports.updateBlockList = async (req, res) => {
  try {
    const { blocklist } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.blocklist = blocklist;
    await user.save();

    res.status(200).json({ blocklist: user.blocklist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
