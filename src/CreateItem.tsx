import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

/* ----------------------------
   Types
----------------------------- */
export type ItemType = {
  name: string;
  price: number;
  description: string;
  sizes: string[];
  images: File[];
};

type Collection = {
  id: string;
  name: string;
};

/* ----------------------------
   Image upload helper
----------------------------- */
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

/* ============================
   CreateItem Component
============================= */
export default function CreateItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  /* Collection autocomplete state */
  const [collectionQuery, setCollectionQuery] = useState("");
  const [collectionSuggestions, setCollectionSuggestions] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ----------------------------
     Size toggle
  ----------------------------- */
  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  /* ----------------------------
     Image selection
  ----------------------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  /* ----------------------------
     Collection search
  ----------------------------- */
  const fetchCollections = async (query: string) => {
	  console.log('F')
	  console.log(query)
    if (!query.trim()) {
      setCollectionSuggestions([]);
      return;
    }
    console.log('G');

    const { data, error } = await supabase
      .from("collections")
      .select("id, name")
      .ilike("name", `%${query}%`)
      .limit(5);
	console.log('H');
	console.log(data);
    if (!error && data) {
      setCollectionSuggestions(data);
    }
    console.log('I');
  };

  const handleCollectionInputChange = (value: string) => {
	  console.log('A');
    setCollectionQuery(value);
    console.log('B');
    setSelectedCollection(null);
    console.log('C');
    setShowSuggestions(true);
    console.log('D');
    fetchCollections(value);
    console.log('E');
  };

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setCollectionQuery(collection.name);
    setCollectionSuggestions([]);
    setShowSuggestions(false);
  };

  /* ----------------------------
     Submit
  ----------------------------- */
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

      if (!selectedCollection) {
        alert("Please select a collection");
        return;
      }

      // 1. Upload images
      const imageUrls =
        images.length > 0 ? await uploadImages(images) : [];

      // 2. Insert item
      const { error } = await supabase.from("items").insert({
        name,
        price,
        description,
        sizes,
        image_urls: imageUrls,
        collection_id: selectedCollection.id,
      });

      if (error) throw error;

      alert("Item created successfully");

      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setSizes([]);
      setImages([]);
      setCollectionQuery("");
      setSelectedCollection(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Failed to create item");
    }
  };

  /* ----------------------------
     UI
  ----------------------------- */
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2>Create Item</h2>

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
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      {/* Collection */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <input
          placeholder="Collection"
          value={collectionQuery}
          onChange={(e) => handleCollectionInputChange(e.target.value)}
          style={{ width: "100%", padding: 12 }}
        />

        {showSuggestions && collectionSuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 8,
              zIndex: 10,
            }}
          >
            {collectionSuggestions.map((collection) => (
              <div
                key={collection.id}
                onClick={() => handleSelectCollection(collection)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {collection.name}
              </div>
            ))}
          </div>
        )}
      </div>

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

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          marginTop: 20,
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
