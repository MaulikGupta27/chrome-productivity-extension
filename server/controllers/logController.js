const Log = require("../models/log");

// Save a log entry (no authentication required)
exports.addLog = async (req, res) => {
  try {
    console.log("📥 Received log:", req.body);

    const { url, timeSpent } = req.body;

    if (!url || !timeSpent) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newLog = new Log({ url, timeSpent });
    await newLog.save();

    res.status(201).json(newLog);
  } catch (err) {
    console.error("❌ Add log error:", err.message);
    res.status(500).json({ error: "Failed to save log." });
  }
};

// Get all logs, sorted by timestamp (most recent first)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Get logs error:", err.message);
    res.status(500).json({ error: "Failed to fetch logs." });
  }
};

// Optional: CSV download (only if you implemented this route)
const { Parser } = require("json2csv");

exports.downloadCSV = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });

    const fields = ["url", "timeSpent", "timestamp"];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(logs);

    res.header("Content-Type", "text/csv");
    res.attachment("usage_logs.csv");
    res.send(csv);
  } catch (err) {
    console.error("❌ CSV download error:", err.message);
    res.status(500).json({ error: "Failed to generate CSV." });
  }
};

exports.getDailyReport = async (req, res) => {
  try {
    const logs = await Log.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            url: "$url",
          },
          totalTime: { $sum: "$timeSpent" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          sites: {
            $push: {
              url: "$_id.url",
              timeSpent: "$totalTime",
            },
          },
        },
      },
      {
        $sort: { _id: -1 }, // latest day first
      },
    ]);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
