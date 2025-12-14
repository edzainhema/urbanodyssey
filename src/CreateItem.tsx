import React, { useState } from "react";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

export type ItemType = {
  name: string;
  price: number;
  description: string;
  sizes: string[];
  images: File[];
};

export default function CreateItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async () => {
	  console.log('YAAAAAAAAAAAAAAA');
  if (!name || images.length === 0) {
    alert("Please complete all required fields.");
    return;
  }

  const imageUrls = images.map(
    (file) => `https://your-storage/${file.name}`
  );

  const res = await fetch("/api/create-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price: price ? Number(price) * 100 : null,
      description: description || null,
      sizes: sizes.length > 0 ? sizes : null,
      images: imageUrls,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed to create item");
    return;
  }

  alert("Item created successfully!");
};



  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "left" }}>Create Item</h2>

      {/* Name */}
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 12, marginBottom: 16 }}
      />

      {/* Sizes */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>Available sizes</div>
        <div style={{ display: "flex", gap: 10 }}>
          {AVAILABLE_SIZES.map((size) => (
            <button
			  type="button"
              key={size}
              onClick={() => toggleSize(size)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: "1px solid black",
                background: sizes.includes(size) ? "black" : "white",
                color: sizes.includes(size) ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {images.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: 100,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          padding: "14px 28px",
          borderRadius: 30,
          border: "none",
          background: "black",
          color: "white",
          cursor: "pointer",
        }}
      >
        Create Item
      </button>
    </div>
  );
}
