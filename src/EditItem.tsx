import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { logAdminAction } from "./lib/logAdminAction";

export default function EditItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [originalName, setOriginalName] = useState("");
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [originalThumbnail, setOriginalThumbnail] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ----------------------------
     Fetch item
  ----------------------------- */
  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("name, price, image_urls, thumbnail")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setName(data.name);
      setPrice(data.price);
      setImageUrls(data.image_urls || []);
      setThumbnail(data.thumbnail || null);

      setOriginalName(data.name);
      setOriginalPrice(data.price);
      setOriginalImageUrls(data.image_urls || []);
      setOriginalThumbnail(data.thumbnail || null);

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  /* ----------------------------
     Save
  ----------------------------- */
  const handleSave = async () => {
    setSaving(true);

    const changes: string[] = [];

    if (name !== originalName) {
      changes.push(`Name changed from "${originalName}" to "${name}"`);
    }

    if (price !== originalPrice) {
      changes.push(`Price changed from ${originalPrice} to ${price}`);
    }

    if (
      JSON.stringify(imageUrls) !==
      JSON.stringify(originalImageUrls)
    ) {
      changes.push("Images were modified");
    }

    if (thumbnail !== originalThumbnail) {
      changes.push(
        `Thumbnail changed from "${originalThumbnail ?? "none"}" to "${thumbnail ?? "none"}"`
      );
    }

    if (changes.length === 0) {
      alert("No changes to save");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("items")
      .update({
        name,
        price,
        image_urls: imageUrls,
        thumbnail,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    const timestamp = new Date().toLocaleString();

    await logAdminAction(
      "Item edited",
      `Item "${originalName}" was edited on ${timestamp}.\n` +
        `Changes:\n` +
        `${changes.map((c) => `${c};`).join("\n")}`
    );

    navigate("/admin/items");
  };

  /* ----------------------------
     Loading state
  ----------------------------- */
  if (loading) {
    return (
      <div style={centered}>
        <img src="/image_six.png" style={{ width: 32 }} />
      </div>
    );
  }

  /* ----------------------------
     UI
  ----------------------------- */
  return (
    <div style={container}>
      <h2 style={title}>Edit Item</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <label>Price</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        style={input}
      />

      {/* Images & Thumbnail */}
      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 6 }}>
          Images (★ = main thumbnail)
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {imageUrls.map((url, i) => {
            const isThumbnail = thumbnail === url;

            return (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={url}
                  alt=""
                  style={{
                    width: 80,
                    height: 100,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: isThumbnail
                      ? "2px solid black"
                      : "1px solid #ddd",
                  }}
                  onClick={() =>
                    setImageUrls((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  title="Click image to remove"
                />

                {/* Set thumbnail */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnail(url);
                  }}
                  title="Set as thumbnail"
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    fontWeight: isThumbnail ? 700 : 400,
                  }}
                >
                  ★
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={button}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

/* ----------------------------
   Styles
----------------------------- */
const centered: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const container: React.CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: 16,
};

const title = {
  fontSize: 20,
  fontWeight: 500,
  marginBottom: 16,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const button: React.CSSProperties = {
  marginTop: 20,
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  background: "black",
  color: "white",
  cursor: "pointer",
};
