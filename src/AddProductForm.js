import React, { useState, useEffect } from "react";

function AddProductForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitWeightGr, setUnitWeightGr] = useState("");
  const [lowQuantity, setLowQuantity] = useState("");

  useEffect(() => {
    setName("");
    setQuantity("");
    setUnitWeightGr("");
    setLowQuantity("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !unitWeightGr) {
      alert("Please fill in Name, Quantity and Unit Weight");
      return;
    }
    const payload = {
      name: name.toUpperCase(),
      quantity: Number(quantity),
      unitWeightGr: Number(unitWeightGr),
      lowQuantity: Number(lowQuantity || 0),
    };
    const ok = await onSubmit(payload);
    if (ok) {
      setName("");
      setQuantity("");
      setUnitWeightGr("");
      setLowQuantity("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 w-full mb-4 bg-white shadow-lg rounded px-4 py-3"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        style={{ textTransform: "uppercase" }}
        className="border rounded px-3 py-2 flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="border rounded px-3 py-2 w-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        value={unitWeightGr}
        onChange={(e) => setUnitWeightGr(e.target.value)}
        placeholder="Unit Weight (g)"
        className="border rounded px-3 py-2 w-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        value={lowQuantity}
        onChange={(e) => setLowQuantity(e.target.value)}
        placeholder="Low Qty Alert (e.g., 5)"
        className="border rounded px-3 py-2 w-50 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    <button
      type="submit"
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
    >
      💎 Add Product
    </button>

    </form>
  );
}

export default AddProductForm;
