// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaFileExport } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InventoryTab from "./InventoryTab";
import TailwindLoader from "./TailwindLoader";
import SplashScreen from "./SplashScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import GoldInventoryTab from "./pages/Inventory/GoldInventoryTab";
import SilverInventoryTab from "./pages/Inventory/SilverInventoryTab";
import { useAuth } from "./context/AuthContext";


const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5050"
    : "https://jewelry-inventory-backend.onrender.com";

function App() {
  const { isAuthenticated, token, role, logout, loading: authLoading } = useAuth();

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
  // Theme (Dark Mode)
  // inside App.js
  const [darkMode, setDarkMode] = useState(() => {
    // initialize from localStorage
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);






  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Attach token to axios
  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  // Fetch products when authenticated
  useEffect(() => {
    const load = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        await fetchProducts();
        setIsLoading(false);
      } else {
        setProducts([]);
        setIsLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/all`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/add`, data);
      toast.success("✅ Product added successfully!");
      fetchProducts();
      setShowAddProduct(false);
    } catch (err) {
      console.error("Add Product Error:", err);
      toast.error("❌ Failed to add product");
    }
  };

  const submitRowAction = async () => {
    if (!rowAction?.id || !rowAction?.mode) return;
    const qty = Number(rowAction.value || 0);
    if (!qty) return toast.info("Please enter a quantity");
    try {
      const payload = rowAction.mode === "add" ? { addQty: qty } : { sellQty: qty };
      await axios.put(`${API_BASE_URL}/api/products/update/${rowAction.id}`, payload);
      toast.success("✅ Quantity updated successfully!");
      fetchProducts();
      setRowAction(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quantity");
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
      toast.success("📤 Export successful!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("❌ Export failed");
    }
  };

  // 📄 Export as PDF
  const handleExportPDF = async (type) => {
    let url = `${API_BASE_URL}/api/products/export-pdf?type=${type}`;
    if (type === "custom" && customStart && customEnd) {
      url += `&start=${customStart}&end=${customEnd}`;
    }
    try {
      const res = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `inventory_${type}_${Date.now()}.pdf`;
      link.click();
      toast.success("📄 PDF exported successfully!");
    } catch (err) {
      console.error("Export PDF failed:", err);
      toast.error("❌ PDF export failed");
    }
  };
  // Calendar Tab Logic
  const CalendarTab = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const disableFutureDates = ({ date }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    };

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/products/transactions/by-date`);
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
      const selDate = selectedDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
      return txDate === selDate;
    });

    const orderedTransactions = [...filteredTransactions].sort((a, b) => {
      if (a.isActive === b.isActive) return 0;
      return a.isActive ? -1 : 1;
    });

    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
        {/* Calendar */}
        <div className="lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h2 className="calendar-heading text-xl font-semibold mb-4 text-center">
            📆 Select a Date
          </h2>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={disableFutureDates}
            className="transition-all duration-300"
          />
        </div>

        {/* Transactions */}
        <div className="lg:w-2/3 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Transactions on{" "}
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

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading transactions...</div>
          ) : orderedTransactions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {/* Add a fixed max height & vertical scroll */}
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Make the header sticky */}
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-center">Category</th> {/* ✅ added */}
                      <th className="px-4 py-2 text-center">Opening</th>
                      <th className="px-4 py-2 text-center">Added</th>
                      <th className="px-4 py-2 text-center">Sold</th>
                      <th className="px-4 py-2 text-center">Closing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderedTransactions.map((t) => (
                      <tr
                        key={t._id}
                        className={`${t.isActive === false
                          ? "archived-row"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                      >
                        <td className="px-4 py-2">{t.sku}</td>
                        <td className="px-4 py-2 uppercase flex items-center gap-2">
                          {t.productName}
                          {t.isActive === false && (
                            <span
                              className="relative group cursor-pointer select-none not-italic"
                              aria-label="Archived Product"
                            >
                              <span
                                className="text-lg not-italic inline-block"
                                role="img"
                                aria-label="Archived Product"
                              >
                                🗑️
                              </span>
                              {/* Tooltip */}
                              <div
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
      hidden group-hover:flex group-active:flex 
      bg-yellow-500 text-black text-xs font-semibold 
      px-3 py-1.5 rounded-lg shadow-lg opacity-0 
      group-hover:opacity-100 group-active:opacity-100 
      transition-all duration-300 ease-out pointer-events-none
      ring-1 ring-yellow-300/40 backdrop-blur-sm whitespace-nowrap z-50"
                              >
                                Deleted From Inventory
                                <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-yellow-500 rotate-45"></div>
                              </div>
                            </span>

                          )}
                        </td>

                        {/* ✅ Category Column */}
                        <td className="px-4 py-2 text-center">
                          {t.category || "General"}
                        </td>
                        <td className="px-4 py-2 text-center">{t.openingQty}</td>
                        <td className="px-4 py-2 text-center">{t.addedQty}</td>
                        <td className="px-4 py-2 text-center">{t.soldQty}</td>
                        <td className="px-4 py-2 text-center">{t.closingQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <div className="flex justify-center mb-4">
                <span className="text-6xl">📭</span>
              </div>
              <h3 className="text-xl font-semibold">No Transactions Found</h3>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Auth logic
  if (authLoading) return <SplashScreen />;
  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </>
    );
  }

  if (isLoading) return <SplashScreen />;

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
        role={role}
      />


      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <TailwindLoader />

        {/* Tabs only — Profile dropdown removed */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-2 rounded-full font-medium shadow-md transition-all transform hover:scale-105 ${activeTab === "inventory"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            📦 Inventory
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-6 py-2 rounded-full font-medium shadow-md transition-all transform hover:scale-105 ${activeTab === "calendar"
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            📅 Calendar
          </button>
        </div>

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
              showAddProduct={showAddProduct}
              setShowAddProduct={setShowAddProduct}
            />
          )}

          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "profile" && <Profile user={{ name: "Admin User", role }} />}
          {activeTab === "settings" && (
            <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
          )}


          {["dashboard", "reports", "settings"].includes(activeTab) && (
            <div className="text-center py-20 text-gray-600 text-lg">
              {activeTab === "dashboard" && "📊 Dashboard coming soon..."}
              {activeTab === "reports" && "📈 Reports feature coming soon..."}
              {/* {activeTab === "settings" && "⚙️ Settings panel coming soon..."} */}
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

        {/* Export popup (unchanged) */}
        {showExportPopup && (
          <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[400px] shadow-2xl animate-fadeIn relative transition-all">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
                Export Transactions
              </h2>

              {/* Tabs */}
              <div className="flex mb-4 border-b border-gray-300 dark:border-gray-600">
                <button
                  className={`flex-1 py-2 ${activeExportTab === "quick"
                    ? "border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                    }`}
                  onClick={() => setActiveExportTab("quick")}
                >
                  Quick Range
                </button>
                <button
                  className={`flex-1 py-2 ${activeExportTab === "custom"
                    ? "border-b-2 border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                    }`}
                  onClick={() => setActiveExportTab("custom")}
                >
                  Custom Range
                </button>
              </div>

              {/* --- Quick Range --- */}
              {activeExportTab === "quick" ? (
                <div className="space-y-3">
                  {(() => {
                    const exportRanges = [
                      "today",
                      "yesterday",
                      "this_month",
                      "last_3_months",
                      "this_year",
                      "all_data", // ✅ Added "All Data" option
                    ];

                    return exportRanges.map((range) => (
                      <div
                        key={range}
                        className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <span className="font-medium">
                          {range === "all_data"
                            ? "All Data"
                            : range.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>

                        <div className="flex gap-4">
                          {/* Excel Export */}
                          <div className="relative group cursor-pointer select-none">
                            <button
                              onClick={() => handleExport(range === "all_data" ? "all" : range)}
                              className="text-xl hover:scale-110 transition-transform"
                            >
                              📤
                            </button>
                            <div
                              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
              hidden group-hover:flex group-active:flex 
              bg-blue-500 text-white text-xs font-medium 
              px-3 py-1.5 rounded-lg shadow-lg opacity-0 
              group-hover:opacity-100 group-active:opacity-100 
              transition-all duration-300 ease-out pointer-events-none
              ring-1 ring-blue-300/40 backdrop-blur-sm whitespace-nowrap z-50"
                            >
                              Export as Excel
                              <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
                            </div>
                          </div>

                          {/* PDF Export */}
                          <div className="relative group cursor-pointer select-none">
                            <button
                              onClick={() => handleExportPDF(range === "all_data" ? "all" : range)}
                              className="text-xl hover:scale-110 transition-transform"
                            >
                              📄
                            </button>
                            <div
                              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
              hidden group-hover:flex group-active:flex 
              bg-red-500 text-white text-xs font-medium 
              px-3 py-1.5 rounded-lg shadow-lg opacity-0 
              group-hover:opacity-100 group-active:opacity-100 
              transition-all duration-300 ease-out pointer-events-none
              ring-1 ring-red-300/40 backdrop-blur-sm whitespace-nowrap z-50"
                            >
                              Export as PDF
                              <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}

                </div>
              ) : (
                // --- Custom Range ---
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded mb-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  />

                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded mb-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  />

                  <div className="flex justify-center gap-6 mt-5">
                    {/* Excel Export Icon */}
                    <div className="relative group cursor-pointer select-none">
                      <button
                        onClick={() => handleExport("custom")}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        📤
                      </button>
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  hidden group-hover:flex group-active:flex 
                  bg-blue-500 text-white text-xs font-medium 
                  px-3 py-1.5 rounded-lg shadow-lg opacity-0 
                  group-hover:opacity-100 group-active:opacity-100 
                  transition-all duration-300 ease-out pointer-events-none
                  ring-1 ring-blue-300/40 backdrop-blur-sm whitespace-nowrap z-50"
                      >
                        Export as Excel
                        <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
                      </div>
                    </div>

                    {/* PDF Export Icon */}
                    <div className="relative group cursor-pointer select-none">
                      <button
                        onClick={() => handleExportPDF("custom")}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        📄
                      </button>
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  hidden group-hover:flex group-active:flex 
                  bg-red-500 text-white text-xs font-medium 
                  px-3 py-1.5 rounded-lg shadow-lg opacity-0 
                  group-hover:opacity-100 group-active:opacity-100 
                  transition-all duration-300 ease-out pointer-events-none
                  ring-1 ring-red-300/40 backdrop-blur-sm whitespace-nowrap z-50"
                      >
                        Export as PDF
                        <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                className="mt-6 w-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white py-2 rounded-full shadow-md transition-transform hover:scale-105"
                onClick={() => setShowExportPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}



export default App;
