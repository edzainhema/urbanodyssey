import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

export type ItemType = {
  name: string;
  price: number;
  description: string;
  sizes: string[];
  images: File[];
};

async function uploadImages(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("item-images")
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
}


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
  try {
    if (!name.trim()) {
      alert("Item name is required");
      return;
    }

    if (price === "" || Number(price) <= 0) {
      alert("Valid price required");
      return;
    }

    if (sizes.length === 0) {
      alert("Select at least one size");
      return;
    }

    // 1. Upload images
    const imageUrls =
      images.length > 0 ? await uploadImages(images) : [];

    // 2. Insert row into Supabase
    const { error } = await supabase.from("items").insert({
      name,
      price,
      description,
      sizes,
      image_urls: imageUrls,
    });

    if (error) throw error;

    alert("Item created successfully");

    // 3. Reset form
    setName("");
    setPrice("");
    setDescription("");
    setSizes([]);
    setImages([]);
  } catch (err: any) {
    console.error(err);
    alert(err.message ?? "Failed to create item");
  }
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
