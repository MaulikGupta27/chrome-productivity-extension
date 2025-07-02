const express = require("express");
const router = express.Router();
const { getBlockList, updateBlockList } = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/blocklist", requireAuth, getBlockList);
router.post("/blocklist", requireAuth, updateBlockList);

module.exports = router;
