// src/pages/Inventory/GoldInventoryTab.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import AddProductForm from "../../AddProductForm";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5050"
    : "https://jewelry-inventory-backend.onrender.com";

function GoldInventoryTab() {
  const { token } = useAuth();
  const [goldProducts, setGoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // ✅ Fetch only Gold category products (frontend filter)
  const fetchGoldProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const goldItems = (res.data || []).filter(
        (p) => p.category && p.category === "Gold"
      );
      setGoldProducts(goldItems);
    } catch (err) {
      console.error("❌ Failed to fetch gold inventory", err);
      toast.error("Failed to load Gold inventory!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchGoldProducts();
  }, [token]);

  // ✅ Add new Gold product
  const handleAddProduct = async (data) => {
    try {
      const payload = { ...data, category: "Gold" }; // Force category
      await axios.post(`${API_BASE_URL}/api/products/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Gold product added successfully!");
      setShowAddProduct(false);
      fetchGoldProducts();
    } catch (err) {
      console.error("Add Gold Product Error:", err);
      toast.error("❌ Failed to add Gold product");
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-yellow-600">
          🪙 Gold Inventory
        </h2>

        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className={`inline-flex items-center justify-center gap-2 font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto
            ${showAddProduct
              ? "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
              : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900"
            }`}
        >
          {showAddProduct ? "✖ Close" : "+ Add Product"}
        </button>
      </div>
      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductForm
          onSubmit={handleAddProduct}
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading Gold inventory...</p>
        ) : goldProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No gold products found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <div className="max-h-[420px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-yellow-100 dark:bg-yellow-900/30 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      SKU
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {goldProducts.map((item) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all ${
                        !item.isActive ? "archived-row" : ""
                      }`}
                    >
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-center">
                        {item.isActive ? (
                          <span className="text-green-600 font-medium">Active</span>
                        ) : (
                          <span className="text-gray-400 italic">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default GoldInventoryTab;
