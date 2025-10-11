import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

// ✅ 1️⃣ Apply theme immediately before React mounts (to prevent reset or flash)
(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (err) {
    console.warn("Theme load error:", err);
  }
})();

// ✅ 2️⃣ Now render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
