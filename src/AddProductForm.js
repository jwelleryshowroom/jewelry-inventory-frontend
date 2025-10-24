// src/AddProductForm.js
import React, { useState } from "react";

const AddProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    lowQuantity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) return;
    onSubmit(formData);
    setFormData({ name: "", quantity: "", lowQuantity: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-end justify-center bg-white/90 dark:bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all"
    >
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white placeholder-gray-400 shadow-sm"
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white placeholder-gray-400 shadow-sm"
      />
      <input
        type="number"
        name="lowQuantity"
        value={formData.lowQuantity}
        onChange={handleChange}
        placeholder="Low Qty Alert (e.g. 5)"
        className="w-52 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 bg-white placeholder-gray-400 shadow-sm"
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
      >
        💎 Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
