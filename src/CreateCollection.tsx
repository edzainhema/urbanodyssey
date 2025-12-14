import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

/**
 * Upload collection images to Supabase Storage
 * --------------------------------------------
 * Returns an array of public URLs
 */
async function uploadCollectionImages(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("collection-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("collection-images")
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
}

/**
 * CreateCollection
 * ----------------
 * Creates a new collection with:
 * - name
 * - description
 * - release date
 * - images
 */
export default function CreateCollection() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* Image selection */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  /* Submit handler */
  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        alert("Collection name is required");
        return;
      }

      setLoading(true);

      // 1) Upload images (if any)
      const imageUrls =
        images.length > 0
          ? await uploadCollectionImages(images)
          : [];

      // 2) Insert into collections table
      const { error } = await supabase
        .from("collections")
        .insert({
          name,
          description,
          release_date: releaseDate || null,
          image_urls: imageUrls,
        });

      if (error) throw error;

      alert("Collection created successfully");

      // 3) Reset form
      setName("");
      setDescription("");
      setReleaseDate("");
      setImages([]);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 16,
      }}
    >
      <h2>Create Collection</h2>

      <input
        placeholder="Collection name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
      />

      <input
        type="date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        style={{ width: "100%", padding: 12, marginBottom: 16 }}
      />

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {images.map((file, i) => (
          <img
            key={i}
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "14px 28px",
          borderRadius: 30,
          border: "none",
          background: "black",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Collection"}
      </button>
    </div>
  );
}
