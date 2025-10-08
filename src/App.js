import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaFileExport, FaTrash } from "react-icons/fa";

import InventoryTab from "./InventoryTab";
import TailwindLoader from "./TailwindLoader";
import SplashScreen from "./SplashScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://jewelry-inventory-backend.onrender.com";

const devAlert = (msg) => {
  if (process.env.NODE_ENV === "development") alert(msg);
  else console.log("[INFO]", msg);
};

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rowAction, setRowAction] = useState(null);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [activeExportTab, setActiveExportTab] = useState("quick");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts().finally(() => setIsLoading(false));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/all`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      devAlert("Failed to fetch products");
    }
  };

const handleAddProduct = async (data) => {
  console.log("📦 Add Product Triggered — Sending Data:", data); // 👈 Add this line

  try {
    const res = await axios.post(`${API_BASE_URL}/api/products/add`, data);
    console.log("✅ API Response:", res.data); // 👈 Add this too
    devAlert("✅ Product added successfully!");
    fetchProducts();
    setShowAddProduct(false);
    return true;
} catch (err) {
  console.error("❌ Add Product API Error:", err.response?.data || err.message || err);
  devAlert("❌ Failed to add product");
  return false;
}
};


  const submitRowAction = async () => {
    if (!rowAction?.id || !rowAction?.mode) return;
    const qty = Number(rowAction.value || 0);
    if (!qty) {
      devAlert("Please enter a quantity");
      return;
    }
    try {
      const payload =
        rowAction.mode === "add" ? { addQty: qty } : { sellQty: qty };
      await axios.put(
        `${API_BASE_URL}/api/products/update/${rowAction.id}`,
        payload
      );
      devAlert("✅ Quantity updated successfully!");
      fetchProducts();
      setRowAction(null);
    } catch (err) {
      console.error(err);
      devAlert("❌ Failed to update quantity");
    }
  };

  const handleExport = async (type) => {
    let url = `${API_BASE_URL}/api/products/export?type=${type}`;
    if (type === "custom" && customStart && customEnd) {
      url += `&start=${customStart}&end=${customEnd}`;
    }
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `inventory_${type}_${Date.now()}.xlsx`;
      link.click();
      setShowExportPopup(false);
    } catch (err) {
      console.error("❌ Export failed:", err);
      devAlert("Export failed");
    }
  };

// ✅ Calendar Tab - Modernized
const CalendarTab = () => {
  const disableFutureDates = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const productsByDate = products
    .filter((p) => {
      const d = new Date(p.updatedAt || p.createdAt);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    })
    .sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
      {/* 📅 Calendar Section */}
      <div className="lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          📆 Select a Date
        </h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileDisabled={disableFutureDates}
          className="transition-all duration-300"
        />
      </div>

      {/* 📊 Transactions Table */}
      <div className="lg:w-2/3 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Products on{" "}
            {selectedDate.getFullYear()}-
            {(selectedDate.getMonth() + 1).toString().padStart(2, "0")}- 
            {selectedDate.getDate().toString().padStart(2, "0")}
          </h3>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
            onClick={() => setShowExportPopup(true)}
          >
            <FaFileExport /> Export
          </button>
        </div>

        {productsByDate.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-center">Opening</th>
                  <th className="px-4 py-2 text-center">Added</th>
                  <th className="px-4 py-2 text-center">Sold</th>
                  <th className="px-4 py-2 text-center">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productsByDate.map((p) => (
                  <tr
                    key={p._id}
                    className="bg-white hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{p.sku}</td>
                    <td
                      className={`px-4 py-2 uppercase flex items-center gap-2 ${
                        p.isActive === false ? "text-gray-500 text-sm" : ""
                      }`}
                    >
                      {p.name}
                      {p.isActive === false && (
                        <span
                          className="text-gray-400 cursor-pointer hover:text-red-500 transition"
                          title="Permanently delete this archived product"
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "⚠️ This will permanently delete this product. Are you sure?"
                              )
                            )
                              return;
                            try {
                              await axios.delete(
                                `${API_BASE_URL}/api/products/delete/${p._id}`
                              );
                              devAlert("🗑️ Product permanently deleted");
                              fetchProducts();
                            } catch (err) {
                              console.error(err);
                              devAlert("❌ Failed to delete permanently");
                            }
                          }}
                        >
                          <FaTrash />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">{p.openingQty}</td>
                    <td className="px-4 py-2 text-center">{p.addedQty}</td>
                    <td className="px-4 py-2 text-center">{p.soldQty}</td>
                    <td className="px-4 py-2 text-center">{p.closingQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <div className="flex justify-center mb-4">
                <span className="text-6xl">📭</span>
              </div>
              <h3 className="text-xl font-semibold">No Transactions Found</h3>
              <p className="text-sm text-gray-400 mt-2">
                It looks like there are no inventory changes recorded for this date.<br />
                Try selecting a different date on the calendar.
              </p>
            </div>
          )}

      </div>
    </div>
  );
};


  if (isLoading) return <SplashScreen />;

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <TailwindLoader />

        {/* Tab Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-2 rounded-full font-medium shadow-md transition-all transform hover:scale-105 ${
              activeTab === "inventory"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📦 Inventory
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-6 py-2 rounded-full font-medium shadow-md transition-all transform hover:scale-105 ${
              activeTab === "calendar"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📅 Calendar
          </button>
        </div>

        {/* Smooth Fade Transition for Tabs */}
        <div key={activeTab} className="transition-opacity duration-500 ease-in-out animate-fadeIn">
          {activeTab === "inventory" && (
            <InventoryTab
              products={products}
              debouncedQuery={debouncedQuery}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              rowAction={rowAction}
              setRowAction={setRowAction}
              handleAddProduct={handleAddProduct}
              submitRowAction={submitRowAction}
              fetchProducts={fetchProducts}
              API_BASE_URL={API_BASE_URL}
              devAlert={devAlert}
              showAddProduct={showAddProduct}
              setShowAddProduct={setShowAddProduct}
            />
          )}

          {activeTab === "calendar" && <CalendarTab />}

          {/* Coming Soon Pages */}
          {["dashboard", "reports", "settings"].includes(activeTab) && (
            <div className="text-center py-20 text-gray-600 text-lg">
              {activeTab === "dashboard" && "📊 Dashboard coming soon..."}
              {activeTab === "reports" && "📈 Reports feature coming soon..."}
              {activeTab === "settings" && "⚙️ Settings panel coming soon..."}
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-md transition-transform transform hover:scale-105"
                >
                  🏠 Go Back to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Popup */}
        {showExportPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl transform transition-all scale-95 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">Export Transactions</h2>
              <div className="flex mb-4 border-b">
                <button
                  className={`flex-1 py-2 ${
                    activeExportTab === "quick"
                      ? "border-b-2 border-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveExportTab("quick")}
                >
                  Quick Range
                </button>
                <button
                  className={`flex-1 py-2 ${
                    activeExportTab === "custom"
                      ? "border-b-2 border-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveExportTab("custom")}
                >
                  Custom Range
                </button>
              </div>

              {activeExportTab === "quick" ? (
                <div className="space-y-2">
                  {["today", "yesterday", "this_month", "last_3_months", "this_year"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => handleExport(type)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                      >
                        📤 {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm">Start Date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                  />
                  <label className="block mb-2 text-sm">End Date</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                  />
                  <button
                    onClick={() => handleExport("custom")}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                  >
                    📤 Export
                  </button>
                </div>
              )}

              <button
                className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                onClick={() => setShowExportPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
