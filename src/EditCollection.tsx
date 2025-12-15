import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { logAdminAction } from "./lib/logAdminAction";

export default function EditCollection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // originals for diffing
  const [originalName, setOriginalName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ----------------------------
     Fetch collection
  ----------------------------- */
  useEffect(() => {
    const fetchCollection = async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("name, description, image_urls")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setName(data.name);
      setDescription(data.description || "");
      setImageUrls(data.image_urls || []);

      // store originals
      setOriginalName(data.name);
      setOriginalDescription(data.description || "");
      setOriginalImageUrls(data.image_urls || []);

      setLoading(false);
    };

    fetchCollection();
  }, [id]);

  /* ----------------------------
     Save
  ----------------------------- */
  const handleSave = async () => {
    setSaving(true);

    const changes: string[] = [];

    // detect changes
    if (name !== originalName) {
      changes.push(
        `Name changed from "${originalName}" to "${name}"`
      );
    }

    if (description !== originalDescription) {
	  changes.push(
	    `Description changed from "${originalDescription}" to "${description}"`
	  );
	}


    if (
      JSON.stringify(imageUrls) !==
      JSON.stringify(originalImageUrls)
    ) {
      changes.push("Images were modified");
    }

    if (changes.length === 0) {
      alert("No changes to save");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("collections")
      .update({
        name,
        description,
        image_urls: imageUrls,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    const timestamp = new Date().toLocaleString();

    await logAdminAction(
      "Collection edited",
      `Collection "${originalName}" was edited on ${timestamp}.\n` +
        `Changes:\n` +
        `${changes.map((c) => `${c};`).join("\n")}`
    );

    navigate("/admin/collections");
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
      <h2 style={title}>Edit Collection</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...input, height: 80 }}
      />

      {/* Images */}
      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 6 }}>Images</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {imageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() =>
                setImageUrls((prev) =>
                  prev.filter((_, index) => index !== i)
                )
              }
              title="Click to remove"
            />
          ))}
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

const title = { fontSize: 20, fontWeight: 500, marginBottom: 16 };

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
