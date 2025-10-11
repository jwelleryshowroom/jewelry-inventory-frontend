import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaSignInAlt, FaUserSecret, FaGem } from "react-icons/fa";

export default function Login() {
  const { login, continueAsGuest } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(username, password);
      toast.success(`✅ Logged in as ${res.role}`);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("❌ Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    toast.info("👤 Logged in as Guest (view-only)");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative transition-colors duration-300">
      
      {/* 💎 Header */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <FaGem className="text-yellow-500 text-3xl" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Jewellery Inventory</h1>
      </div>

      {/* 🪪 Login Card */}
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md mt-12 sm:mt-16 transform transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Sign in to manage your inventory efficiently
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
              Username
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md h-12 px-4 focus-within:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none border-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
              Password
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md h-12 px-4 focus-within:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none border-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-full text-lg font-semibold shadow-md transition-transform transform hover:scale-[1.02]"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <FaSignInAlt className="inline mr-2" /> Login
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Guest Button */}
        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2.5 rounded-full text-lg font-semibold shadow-sm transition-transform transform hover:scale-[1.02]"
        >
          <FaUserSecret className="inline mr-2" /> Continue as Guest
        </button>
      </div>
    </div>
  );
}
