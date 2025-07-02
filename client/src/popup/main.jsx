import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState("live");

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const loadLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logs");
      const data = await res.json();

      const domainMap = {};
      data.forEach(({ url, timeSpent }) => {
        domainMap[url] = (domainMap[url] || 0) + timeSpent;
      });

      const groupedLogs = Object.entries(domainMap)
        .map(([url, timeSpent]) => ({ url, timeSpent }))
        .sort((a, b) => b.timeSpent - a.timeSpent);

      setLogs(groupedLogs);
      setTotal(groupedLogs.reduce((sum, log) => sum + log.timeSpent, 0));
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  const loadDailyLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logs/daily");
      const data = await res.json();
      setDailyLogs(data);
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    }
  };

  useEffect(() => {
    if (view === "live") {
      loadLogs();
      const interval = setInterval(loadLogs, 5000);
      return () => clearInterval(interval);
    } else {
      loadDailyLogs();
    }
  }, [view]);

  const top = logs.slice(0, 3);
  const others = logs.slice(3);

  return (
    <div className="w-[320px] p-4 font-sans text-sm text-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {view === "live" ? "Live Usage" : "Daily Report"}
        </h2>
        <button
          className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition"
          onClick={() => setView(view === "live" ? "daily" : "live")}
        >
          Switch to {view === "live" ? "Daily" : "Live"}
        </button>
      </div>

      {view === "live" ? (
        <>
          <p className="text-gray-500 mb-4">Total Time: {formatTime(total)}</p>

          <div className="space-y-4">
            {top.map((log, i) => {
              const width = total ? (log.timeSpent / total) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1 font-medium">
                    <span className="truncate">{log.url}</span>
                    <span>{formatTime(log.timeSpent)}</span>
                  </div>
                  <div className="h-2 bg-gray-300 rounded-full">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {others.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-sm font-semibold text-gray-700">
                Other Sites
              </h3>
              <ul className="space-y-1">
                {others.map((log, i) => (
                  <li key={i} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-[200px]">{log.url}</span>
                    <span>{formatTime(log.timeSpent)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {dailyLogs.length === 0 ? (
            <p className="text-gray-500">No daily data available</p>
          ) : (
            dailyLogs.map((day, i) => (
              <div key={i} className="border-b pb-2">
                <h4 className="font-semibold text-gray-700 mb-1">{day.date}</h4>
                <ul className="space-y-1 text-gray-600">
                  {day.sites.map((site, j) => (
                    <li key={j} className="flex justify-between">
                      <span className="truncate max-w-[200px]">{site.url}</span>
                      <span>{formatTime(site.timeSpent)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
