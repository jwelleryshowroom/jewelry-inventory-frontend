// src/pages/Profile.jsx
import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700 animate-fadeIn w-full max-w-md mx-auto mt-10 sm:mt-12">
      
      {/* 👤 Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {user?.name || "User"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
          Role: {user?.role || "Staff"}
        </p>
      </div>

      {/* 🧾 User Details */}
      <div className="mt-8 space-y-4 text-gray-700 dark:text-gray-300 w-full">
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="font-medium">Username</span>
          <span>{user?.username || user?.name || "Admin User"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="font-medium">Role</span>
          <span className="capitalize">{user?.role || "admin"}</span>
        </div>

        {/* Optional Email */}
        {user?.email && (
          <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="font-medium">Email</span>
            <span className="truncate max-w-[60%] text-blue-600 dark:text-blue-400">
              {user.email}
            </span>
          </div>
        )}

        {/* Optional Last Login */}
        {user?.lastLogin && (
          <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="font-medium">Last Login</span>
            <span className="text-gray-600 dark:text-gray-400">
              {new Date(user.lastLogin).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="font-medium">Status</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            Active
          </span>
        </div>
      </div>

      {/* ✨ Subtle Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Jewellery Inventory © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Profile;
