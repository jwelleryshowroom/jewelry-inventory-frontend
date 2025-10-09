import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaSignInAlt, FaUserSecret } from "react-icons/fa";

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
      // 🔁 Force reload to render inventory dashboard
      setTimeout(() => {
        window.location.reload();
      }, 800);
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
    // 🔁 Reload to show inventory immediately
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          💎 Jewelry Inventory Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-full text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            {loading ? "Logging in..." : <><FaSignInAlt className="inline mr-2" /> Login</>}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGuestLogin}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
        >
          <FaUserSecret className="inline mr-2" /> Continue as Guest
        </button>
      </div>
    </div>
  );
}
