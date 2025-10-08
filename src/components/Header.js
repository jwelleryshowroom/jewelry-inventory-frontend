import React from "react";
import { FaGem } from "react-icons/fa";

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Reports", key: "reports" },
    { name: "Settings", key: "settings" },
  ];

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <FaGem className="text-yellow-500 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">
            Jewellery Inventory
          </h1>
        </div>
        <nav className="hidden sm:flex gap-6 text-gray-600 font-medium">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`transition-colors ${
                activeTab === item.key
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
