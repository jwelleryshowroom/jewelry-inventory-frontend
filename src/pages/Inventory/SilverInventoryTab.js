// src/pages/Inventory/SilverInventoryTab.js
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

function SilverInventoryTab() {
    const { token } = useAuth();
    const [silverProducts, setSilverProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);

    // ✅ Fetch only Silver category products (frontend filter)
    const fetchSilverProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const silverItems = (res.data || []).filter(
                (p) => p.category && p.category === "Silver"
            );
            setSilverProducts(silverItems);
        } catch (err) {
            console.error("❌ Failed to fetch silver inventory", err);
            toast.error("Failed to load Silver inventory!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchSilverProducts();
    }, [token]);

    // ✅ Add new Silver product
    const handleAddProduct = async (data) => {
        try {
            const payload = { ...data, category: "Silver" }; // Force category
            await axios.post(`${API_BASE_URL}/api/products/add`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("✅ Silver product added successfully!");
            setShowAddProduct(false);
            fetchSilverProducts();
        } catch (err) {
            console.error("Add Silver Product Error:", err);
            toast.error("❌ Failed to add Silver product");
        }
    };

    return (
        <div className="p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-gray-500">
                    🪙 Silver Inventory
                </h2>

                <button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className={`inline-flex items-center justify-center gap-2 font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto
      ${showAddProduct
                            ? "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
                            : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900"
                        }`}
                >
                    {showAddProduct ? "✖ Close" : "+ Add Product"}
                </button>
            </div>


{/* Add Product Form Section */}
<div
  className={`transition-all duration-500 ease-in-out overflow-hidden ${
    showAddProduct
      ? "max-h-[500px] opacity-100 translate-y-0 mt-4 mb-6"
      : "max-h-0 opacity-0 -translate-y-4 mb-0"
  }`}
>
  {showAddProduct && (
    <AddProductForm
      onSubmit={handleAddProduct}
      onClose={() => setShowAddProduct(false)}
    />
  )}
</div>



            {/* Inventory Table */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all">
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Loading Silver inventory...</p>
                ) : silverProducts.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No silver products found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <div className="max-h-[420px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
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
                                    {silverProducts.map((item) => (
                                        <tr
                                            key={item._id}
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${!item.isActive ? "archived-row" : ""
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

export default SilverInventoryTab;
