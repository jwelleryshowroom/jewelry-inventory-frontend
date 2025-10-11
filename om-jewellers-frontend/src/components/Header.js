import React, { useState, useEffect } from "react";
import { FaGem } from "react-icons/fa";

export default function Header({ activeTab, setActiveTab, logout, role }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = { name: "Admin User", role };

  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Reports", key: "reports" },
  ];

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".profile-area")) setShowProfileMenu(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <header className="transition-all duration-300 sticky top-0 z-[60] shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <FaGem className="text-yellow-500 text-2xl" />
          <h1 className="text-2xl font-bold select-none">Jewellery Inventory</h1>
        </div>

        {/* Right: Navigation + Profile */}
        <div className="flex items-center space-x-6">
          {/* Navigation */}
          <nav className="hidden sm:flex gap-6 font-medium">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`transition-all ${
                  activeTab === item.key
                    ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400"
                    : "hover:text-blue-500 dark:hover:text-blue-400"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Profile Dropdown */}
          <div className="relative profile-area">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full font-bold shadow-md flex items-center justify-center hover:scale-105 transition-transform"
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown absolute right-0 mt-3 w-52 rounded-xl shadow-2xl py-2 animate-fadeIn z-[999] 
                bg-white text-gray-800 dark:bg-[#1f2937] dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                <p className="px-4 py-2 text-sm border-b border-gray-200 dark:border-gray-700">
                  Role: <span className="font-semibold">{role || "Admin"}</span>
                </p>

                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  ⚙️ Settings
                </button>

                <button
                onClick={logout}
                className="logout-btn w-full text-left px-4 py-2 flex items-center gap-2 rounded-md transition-colors"
                >
                🔒 Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
