// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";

const Settings = ({ darkMode, setDarkMode }) => {
  const [compactMode, setCompactMode] = useState(false);
  const [accent, setAccent] = useState("blue");

  useEffect(() => {
    // Load stored preferences
    const storedCompact = localStorage.getItem("compactMode") === "true";
    const storedAccent = localStorage.getItem("accentColor") || "blue";

    setCompactMode(storedCompact);
    setAccent(storedAccent);
  }, []);

  useEffect(() => {
    // Save compact + accent settings
    localStorage.setItem("compactMode", compactMode);
    localStorage.setItem("accentColor", accent);
  }, [compactMode, accent]);

  const accents = ["blue", "purple", "green", "pink", "orange"];

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-lg rounded-2xl p-8 border border-gray-200 animate-fadeIn`}
    >
      <h2 className="text-2xl font-semibold mb-6">⚙️ Settings</h2>

      <div className="space-y-4">
        {/* 🌙 Dark Mode Toggle */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-medium">🌙 Dark Mode</h3>
            <p className="text-sm text-gray-500">
              Switch between light and dark themes.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)} // ✅ from App.js
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 peer-checked:after:translate-x-full transition-all"></div>
          </label>
        </div>

        {/* 🧭 Compact Mode */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-medium">🧭 Compact Mode</h3>
            <p className="text-sm text-gray-500">
              Use tighter spacing for small screens or laptops.
            </p>
          </div>
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </div>

        {/* 🎨 Accent Color Picker */}
        <div className="border-b pb-3">
          <h3 className="font-medium mb-2">🎨 Accent Color</h3>
          <div className="flex gap-3">
            {accents.map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className={`w-8 h-8 rounded-full border-2 ${
                  accent === c ? "border-black scale-110" : "border-gray-300"
                } transition-transform`}
                style={{ backgroundColor: c }}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Your preferences are automatically saved.
        </p>
      </div>
    </div>
  );
};

export default Settings;
