// src/InventoryTab.js
import React, { memo, useState } from "react";
import {
    FaPlus,
    FaPlusCircle,
    FaMinusCircle,
    FaCheck,
    FaTimes,
    FaSearch,
    FaBoxOpen,
} from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";

const InventoryTab = memo(function InventoryTab({
    products,
    debouncedQuery,
    searchQuery,
    setSearchQuery,
    rowAction,
    setRowAction,
    handleAddProduct,
    submitRowAction,
    fetchProducts,
    API_BASE_URL,
    showAddProduct,
    setShowAddProduct,
}) {
    const { role, token } = useAuth();
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // ✅ Filter Logic
    const filteredProducts = products
        .filter((p) => p.isActive !== false)
        .filter(
            (p) =>
                (selectedCategory === "All" || p.category === selectedCategory) &&
                (p.sku?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                    p.name?.toLowerCase().includes(debouncedQuery.toLowerCase()))
        );

    return (
        <div className="relative w-full overflow-x-clip">
            {/* 🌟 Category Bar */}
            <div className="flex flex-col items-center">
                <div
                    className="
                        flex justify-center gap-4
                        bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 
                        px-6 pb-3 rounded-3xl shadow-xl 
                        relative z-10 w-auto
                    "
                    style={{
                        borderTopLeftRadius: "100px",
                        borderTopRightRadius: "100px",
                        minWidth: "300px",
                        paddingLeft: "30px",
                        paddingRight: "30px",
                        paddingTop: "20px",
                    }}
                >
                    {["All", "Gold", "Silver"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setShowAddProduct(false);
                            }}
                            className={`px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-sm
                                ${selectedCategory === cat
                                    ? "bg-white text-blue-700 shadow-md"
                                    : "bg-blue-100/70 text-blue-800 hover:bg-blue-200/90"
                                }`}
                        >
                            {cat === "Gold" ? "🪙" : cat === "Silver" ? "⚪" : "📦"} {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header: Search + Add Product */}
            <div className="flex justify-between items-center gap-4 mb-4 mt-4">
                <div className="flex-grow max-w-sm">
                    <div className="relative w-full">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU or Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                        />
                    </div>
                </div>

                {role !== "guest" && (

                    

                    <button
  onClick={() => setShowAddProduct(!showAddProduct)}
  className={`
    inline-flex items-center justify-center gap-2 font-medium 
    px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg 
    transition-transform transform hover:scale-105 
    w-auto
    ${showAddProduct
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl"
    } add-product-fix`}
>
  {showAddProduct ? (
    <>
      <FaTimes /> Close
    </>
  ) : (
    <>
      <FaPlus /> Add Product
    </>
  )}
</button>

                )}
            </div>

            {/* Add Product Form */}
            {showAddProduct && role !== "guest" && (
                <div className="mt-4">
                    <div
                        className={`mb-4 rounded-lg shadow-md transition-all border p-4 ${selectedCategory === "Gold"
                            ? "bg-yellow-50 border-yellow-300 text-inherit dark:bg-yellow-500 dark:border-yellow-700"
                            : selectedCategory === "Silver"
                                ? "bg-white border-gray-300 text-inherit dark:bg-gray-800 dark:border-gray-700"
                                : "bg-blue-50 border-blue-200 text-inherit dark:bg-blue-400 dark:border-blue-700"
                            }`}
                        style={{
                            backgroundColor:
                                document.documentElement.classList.contains("dark")
                                    ? undefined
                                    : selectedCategory === "Gold"
                                        ? "#fffbe6"
                                        : selectedCategory === "Silver"
                                            ? "#f0f0f0"
                                            : "#f0f8ff",
                        }}
                    >
                        <h3
                            className={`text-lg font-semibold mb-3 ${selectedCategory === "Gold"
                                ? "!text-yellow-700 dark:text-yellow-300"
                                : selectedCategory === "Silver"
                                    ? "!text-gray-500 dark:text-gray-300"
                                    : "!text-blue-700 dark:text-blue-300"
                                }`}
                        >
                            {selectedCategory === "Gold"
                                ? "🪙 Add Gold Product"
                                : selectedCategory === "Silver"
                                    ? "⚪ Add Silver Product"
                                    : "➕ Add Product"}
                        </h3>
                        <AddProductForm
                            onSubmit={(data) =>
                                handleAddProduct({
                                    ...data,
                                    category: selectedCategory === "All" ? undefined : selectedCategory,
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {/* ✅ Product Table (responsive fix added below) */}
            <div className="relative rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700 w-full">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {products.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <FaBoxOpen className="text-5xl mx-auto mb-3 text-gray-400" />
                            <p className="text-lg font-semibold">
                                No products listed in inventory
                            </p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <FaSearch className="text-5xl mx-auto mb-3 text-gray-400" />
                            <p className="text-lg font-semibold">
                                No products found for your search
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                max-h-[400px] overflow-y-auto relative
                                scrollbar-thin scrollbar-thumb-gray-100 
                                dark:scrollbar-thumb-gray-700 
                                scrollbar-track-transparent
                            "
                        >
                            <table className="min-w-full text-sm sm:text-base border-collapse table-fixed divide-y divide-gray-200 dark:divide-gray-700 relative">
                                <thead className="sticky top-0 z-[30] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="min-w-[80px] px-4 py-3 text-left font-semibold whitespace-nowrap">
                                            SKU
                                        </th>
                                        <th className="min-w-[120px] px-4 py-3 text-left font-semibold whitespace-nowrap">
                                            Name
                                        </th>
                                        <th className="min-w-[60px] px-4 py-3 text-center font-semibold whitespace-nowrap">
                                            Qty
                                        </th>
                                        <th className="min-w-[200px] px-4 py-3 text-left font-semibold whitespace-nowrap">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 relative z-[10] bg-white dark:bg-gray-800">
                                    {/* ⚙️ Original product rows kept unchanged */}
                                    {filteredProducts.map((p, idx) => {
                                        // ✅ No logic touched
                                        const quantity = Number(p.quantity) || 0;
                                        const lowQuantity = Number(p.lowQuantity) || 0;
                                        const isLowStock =
                                            lowQuantity > 0 && quantity <= lowQuantity;
                                        const isActive = rowAction && rowAction.id === p._id;

                                        return (
                                            // ✅ All your existing row logic unchanged
                                            <tr
                                                key={p._id}
                                                className={`transition sm:text-base text-sm ${document.documentElement.classList.contains("dark")
                                                    ? "bg-gray-800 hover:bg-gray-700"
                                                    : idx % 2 === 0
                                                        ? "bg-white hover:bg-gray-50"
                                                        : "bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {/* ✅ Your original cell structure untouched */}
                                                <td className="px-4 py-2 whitespace-nowrap">{p.sku}</td>
                                                <td className="px-4 py-2 uppercase whitespace-nowrap">{p.name}</td>
                                                <td className="px-4 py-2 text-center whitespace-nowrap">
                                                    <div className="relative inline-flex items-center justify-center min-w-[60px] sm:min-w-[80px]">
                                                        <span className="tabular-nums">{quantity}</span>
                                                        {isLowStock && (
                                                            <span className="relative group cursor-pointer">
                                                                <span className="text-yellow-500 text-lg ml-1">⚠️</span>
                                                                <div
                                                                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 
                                                                        hidden group-hover:flex group-active:flex 
                                                                        bg-yellow-400/95 text-black text-xs font-semibold 
                                                                        px-3 py-1.5 rounded-lg shadow-lg opacity-0 
                                                                        group-hover:opacity-100 group-active:opacity-100 
                                                                        transition-all duration-200 ease-out pointer-events-none 
                                                                        ring-1 ring-yellow-300/40 backdrop-blur-sm whitespace-nowrap z-[999]"
                                                                >
                                                                    Only {quantity} left in inventory (Min: {lowQuantity})
                                                                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-yellow-400 rotate-45"></div>
                                                                </div>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions column untouched */}
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {/* ... existing button logic retained ... */}
                                                    {role === "guest" ? (
                                                        <span className="text-gray-400 text-sm italic">
                                                            View only
                                                        </span>
                                                    ) : !isActive ? (
                                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                                            {/* ✅ Buttons preserved */}
                                                            {(role === "admin" || role === "staff") && (
                                                                <button
                                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                                                                    onClick={() =>
                                                                        setRowAction({
                                                                            id: p._id,
                                                                            mode: "add",
                                                                            value: "",
                                                                        })
                                                                    }
                                                                >
                                                                    <FaPlusCircle className="text-xs sm:text-sm" /> Add
                                                                </button>
                                                            )}
                                                            {(role === "admin" || role === "staff") && (
                                                                <button
                                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                                                                    onClick={() =>
                                                                        setRowAction({
                                                                            id: p._id,
                                                                            mode: "sell",
                                                                            value: "",
                                                                        })
                                                                    }
                                                                >
                                                                    <FaMinusCircle className="text-xs sm:text-sm" /> Sell
                                                                </button>
                                                            )}
                                                            {role === "admin" && (
                                                                <button
                                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                                                                    onClick={() => setDeleteConfirm(p)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                            {/* input + Save + Cancel unchanged */}
                                                            <input
                                                                type="number"
                                                                placeholder={rowAction.mode === "add" ? "Add Qty" : "Sell Qty"}
                                                                value={rowAction.value}
                                                                onChange={(e) =>
                                                                    setRowAction({
                                                                        ...rowAction,
                                                                        value: e.target.value,
                                                                    })
                                                                }
                                                                className={`border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 w-24 sm:w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base shadow-sm
                                                                    ${document.documentElement.classList.contains("dark")
                                                                        ? "bg-gray-800 border-gray-700 text-white"
                                                                        : "bg-white border-gray-300 text-gray-800"} 
                                                                `}
                                                            />
                                                            <button
                                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium shadow-md transition-transform transform hover:scale-105 hover:-translate-y-0.5 text-sm sm:text-base"
                                                                onClick={submitRowAction}
                                                            >
                                                                <FaCheck className="text-xs sm:text-sm" /> Save
                                                            </button>
                                                            <button
                                                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium shadow-sm transition-transform transform hover:scale-105 hover:-translate-y-0.5 text-sm sm:text-base"
                                                                onClick={() => setRowAction(null)}
                                                            >
                                                                <FaTimes className="text-xs sm:text-sm" /> Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* 🧨 Delete Confirmation Modal (unchanged) */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-[90%] sm:w-[400px] text-center animate-fadeIn">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center justify-center gap-2">
                            ⚠️ Confirm Delete
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{deleteConfirm.name}</span>?<br />
                            This action will archive the product from your inventory.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium shadow-md transition-transform transform hover:scale-105 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await axios.put(
                                            `${API_BASE_URL}/api/products/soft-delete/${deleteConfirm._id}`,
                                            {},
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        toast.success("🗑️ Product archived successfully!");
                                        fetchProducts();
                                    } catch {
                                        toast.error("❌ Failed to archive product.");
                                    } finally {
                                        setDeleteConfirm(null);
                                    }
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium shadow-md transition-transform transform hover:scale-105 text-sm sm:text-base"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default InventoryTab;
