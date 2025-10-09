// src/pages/Profile.jsx
import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 animate-fadeIn">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{user?.name || "User"}</h2>
        <p className="text-gray-500 mt-1">Role: {user?.role || "Staff"}</p>
      </div>

      <div className="mt-8 space-y-4 text-gray-700">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Username</span>
          <span>{user?.name || "Admin User"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Role</span>
          <span className="capitalize">{user?.role || "admin"}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Status</span>
          <span className="text-green-600 font-semibold">Active</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
