// src/InventoryTab.js
import React, { memo } from "react";
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

  const filteredProducts = products
    .filter((p) => p.isActive !== false)
    .filter(
      (p) =>
        p.sku?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="text-2xl font-semibold text-center sm:text-left">
            Inventory
          </h2>
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
            />
          </div>
        </div>

        {role !== "guest" && (
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto"
          >
            {showAddProduct ? (
              "Close"
            ) : (
              <>
                <FaPlus /> Add Product
              </>
            )}
          </button>
        )}
      </div>

      {showAddProduct && role !== "guest" && (
        <AddProductForm onSubmit={handleAddProduct} />
      )}

      {/* Product Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
          <table className="min-w-full text-sm sm:text-base divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">
                  SKU
                </th>
                <th className="px-2 sm:px-4 py-2 text-left whitespace-nowrap">
                  Name
                </th>
                <th className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                  Qty
                </th>
                <th
  className="px-14 text-left relative"
>
  Actions
</th>


              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p, idx) => {
                const quantity = Number(p.quantity) || 0;
                const lowQuantity = Number(p.lowQuantity) || 0;
                const isLowStock = lowQuantity > 0 && quantity <= lowQuantity;
                const isActive = rowAction && rowAction.id === p._id;

                return (
                  <tr
                    key={p._id}
                    className={`transition sm:text-base text-sm ${
                        document.documentElement.classList.contains("dark")
                        ? "bg-gray-800 hover:bg-gray-700"
                        : idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    >
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      {p.sku}
                    </td>
                    <td className="px-2 sm:px-4 py-2 uppercase whitespace-nowrap">
                      {p.name}
                    </td>

                    <td className="px-2 sm:px-4 py-2 text-center whitespace-nowrap">
                      <div className="relative inline-flex items-center justify-center min-w-[60px] sm:min-w-[80px]">
                        <span className="tabular-nums">{quantity}</span>
                        {isLowStock && (
                          <span
                            className="absolute right-0 text-lg text-red-500 cursor-pointer low-stock-alert"
                            title={`⚠️ Only ${quantity} left — below minimum stock level of ${lowQuantity}`}
                          >
                            ⚠️
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-2 sm:px-4 py-2">
                      {role === "guest" ? (
                        <span className="text-gray-400 text-sm italic">
                          View only
                        </span>
                      ) : !isActive ? (
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {(role === "admin" || role === "staff") && (
                            <button
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                              onClick={() =>
                                setRowAction({ id: p._id, mode: "add", value: "" })
                              }
                            >
                              <FaPlusCircle className="text-xs sm:text-sm" /> Add
                            </button>
                          )}

                          {(role === "admin" || role === "staff") && (
                            <button
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                              onClick={() =>
                                setRowAction({ id: p._id, mode: "sell", value: "" })
                              }
                            >
                              <FaMinusCircle className="text-xs sm:text-sm" /> Sell
                            </button>
                          )}

                          {role === "admin" && (
                            <button
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md font-medium text-sm sm:text-base transition-transform transform hover:scale-105 hover:-translate-y-0.5"
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `${API_BASE_URL}/api/products/soft-delete/${p._id}`,
                                    {},
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  toast.info("📦 Product archived successfully!");
                                  fetchProducts();
                                } catch {
                                  toast.error("❌ Failed to archive product.");
                                }
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <input
                            type="number"
                            placeholder={
                              rowAction.mode === "add" ? "Add Qty" : "Sell Qty"
                            }
                            value={rowAction.value}
                            onChange={(e) =>
                              setRowAction({ ...rowAction, value: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 w-24 sm:w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base shadow-sm"
                            autoFocus
                          />

                          {/* ✅ Modern Save Button */}
                          <button
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium shadow-md transition-transform transform hover:scale-105 hover:-translate-y-0.5 text-sm sm:text-base"
                            onClick={submitRowAction}
                          >
                            <FaCheck className="text-xs sm:text-sm" /> Save
                          </button>

                          {/* ✅ Modern Cancel Button */}
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
        )}
      </div>
    </div>
  );
});

export default InventoryTab;
