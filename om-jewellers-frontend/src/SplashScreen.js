import React from "react";
import { FaGem } from "react-icons/fa";

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-gray-100 animate-fadeIn">
      <FaGem className="text-yellow-500 text-6xl animate-spin mb-4" />
      <h1 className="text-2xl font-bold text-gray-700 animate-pulse">
        Loading Jewellery Inventory...
      </h1>
    </div>
  );
}
