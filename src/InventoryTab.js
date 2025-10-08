import React, { memo } from "react";
import {
  FaPlus,
  FaPlusCircle,
  FaMinusCircle,
  FaCheck,
  FaTimes,
  FaWeightHanging,
  FaSearch,
  FaBoxOpen,
} from "react-icons/fa";
import AddProductForm from "./AddProductForm";
import axios from "axios";

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
  devAlert,
  showAddProduct,
  setShowAddProduct,
}) {
  console.log("📦 InventoryTab rendered");

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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Inventory</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              key="searchbar"
              type="text"
              placeholder="Search by SKU or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddProduct(!showAddProduct)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          {showAddProduct ? "Close" : (<><FaPlus /> Add Product</>)}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddProduct && <AddProductForm onSubmit={handleAddProduct} />}

      {/* Product Table */}
      <div className="overflow-x-auto">
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
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Total Weight (g)</th>
                <th className="px-4 py-2 text-left">Actions</th>
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
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} transition`}
                  >
                    <td className="px-4 py-2">{p.sku}</td>
                    <td className="px-4 py-2 uppercase">{p.name}</td>

                    {/* ✅ Quantity with Low Stock Alert */}
                    <td className="px-4 py-2 text-center">
                      <div className="relative inline-flex items-center justify-center min-w-[80px]">
                        <span className="tabular-nums">{quantity}</span>
                        <span
                          className={`absolute right-0 text-lg ${
                            isLowStock
                              ? "text-red-500 cursor-pointer low-stock-alert opacity-100"
                              : "opacity-0 pointer-events-none"
                          }`}
                          title={
                            isLowStock
                              ? `⚠️ Only ${quantity} left — below minimum stock level of ${lowQuantity}`
                              : ""
                          }
                        >
                          ⚠️
                        </span>
                      </div>
                    </td>

                    {/* ✅ Total Weight */}
                    <td className="px-4 py-2 text-center">
                      <div className="inline-flex items-center gap-1 justify-center">
                        <FaWeightHanging />
                        <span>{Number(p.totalWeightGr || 0)}</span>
                        <span className="text-xs text-gray-500">
                          ({p.unitWeightGr || 0}g/unit)
                        </span>
                      </div>
                    </td>

                    {/* ✅ Actions */}
                    <td className="px-4 py-2">
                      {!isActive ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-3 py-1 rounded-full shadow-md transition-transform transform hover:scale-105"
                            onClick={() =>
                              setRowAction({ id: p._id, mode: "add", value: "" })
                            }
                            title="Add Quantity"
                          >
                            <FaPlusCircle /> Add Qty
                          </button>

                          <button
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-3 py-1 rounded-full shadow-md transition-transform transform hover:scale-105"
                            onClick={() =>
                              setRowAction({ id: p._id, mode: "sell", value: "" })
                            }
                            title="Sell Quantity"
                          >
                            <FaMinusCircle /> Sell Qty
                          </button>

                          <button
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-3 py-1 rounded-full shadow-md transition-transform transform hover:scale-105"
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  "Are you sure you want to archive this product?"
                                )
                              )
                                return;
                              try {
                                await axios.put(
                                  `${API_BASE_URL}/api/products/soft-delete/${p._id}`
                                );
                                devAlert("✅ Product archived successfully!");
                                fetchProducts();
                              } catch (err) {
                                console.error(err);
                                devAlert("❌ Failed to archive product");
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder={
                              rowAction.mode === "add" ? "Add Qty" : "Sell Qty"
                            }
                            value={rowAction.value}
                            onChange={(e) =>
                              setRowAction({ ...rowAction, value: e.target.value })
                            }
                            className="border rounded px-3 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={submitRowAction}
                            title="Confirm"
                          >
                            <FaCheck /> Save
                          </button>
                          <button
                            className="inline-flex items-center gap-1 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                            onClick={() => setRowAction(null)}
                            title="Cancel"
                          >
                            <FaTimes /> Cancel
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
