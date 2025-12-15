import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { Trash2, Edit } from "lucide-react";
import { logAdminAction } from "./lib/logAdminAction";

/* ----------------------------
   Types
----------------------------- */
type Collection = {
  id: string;
  name: string;
  image_urls: string[];
};

/* ============================
   AdminCollections
============================= */
export default function AdminCollections() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data } = await supabase
      .from("collections")
      .select("id, name, image_urls")
      .order("created_at", { ascending: false });

    if (data) setCollections(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this collection?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  const timestamp = new Date().toLocaleString();

  await logAdminAction(
    "Collection deleted",
    `Collection "${name}" was deleted on ${timestamp}`
  );

  setCollections((prev) => prev.filter((c) => c.id !== id));
};


  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={centered}>
        <img src="/image_six.png" style={{ width: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={title}>Collections</h2>

      {/* SEARCH */}
      <input
        placeholder="Search collections"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {/* GRID */}
      <div style={grid}>
        {filteredCollections.map((collection) => (
          <div key={collection.id} style={card}>
            <img
              src={collection.image_urls[0]}
              alt={collection.name}
              style={image}
              onClick={() =>
                navigate(`/collections/${collection.id}`)
              }
            />

            <div style={name}>{collection.name}</div>

            {/* ACTIONS */}
            <div style={actions}>
              <Edit
                size={16}
                onClick={() =>
                  navigate(`/admin/collections/${collection.id}/edit`)
                }
                style={icon}
              />
              <Trash2
                size={16}
                onClick={() => handleDelete(collection.id, collection.name)}
                style={icon}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------
   Shared styles
----------------------------- */
const centered: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const title = { fontSize: 20, fontWeight: 500, marginBottom: 12 };

const searchStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 16,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 14,
};

const card: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const image: React.CSSProperties = {
  width: "100%",
  aspectRatio: "3 / 4",
  objectFit: "cover",
  cursor: "pointer",
};

const name = { marginTop: 6, fontSize: 14, fontWeight: 500 };

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 6,
};

const icon: React.CSSProperties = {
  cursor: "pointer",
  opacity: 0.6,
};
