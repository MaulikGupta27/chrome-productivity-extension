const express = require("express");
const router = express.Router();

const {
  addLog,
  getLogs,
  downloadCSV,
  getDailyReport,
} = require("../controllers/logController");

// const { requireAuth } = require("../middleware/authMiddleware");

router.post("/", addLog);
router.get("/", getLogs);
router.get("/download", downloadCSV);
router.get("/daily", getDailyReport);

module.exports = router;
