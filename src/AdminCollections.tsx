import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await supabase
        .from("collections")
        .select("id, name, image_urls")
        .order("created_at", { ascending: false });

      if (data) {
        setCollections(data);
      }

      setLoading(false);
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/image_six.png" style={{ width: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        Collections
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() =>
              navigate(`/collections/${collection.id}`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <img
              src={collection.image_urls[0]}
              alt={collection.name}
              style={{
                width: 44,
                height: 44,
                borderRadius: 4,
                objectFit: "cover",
              }}
            />

            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {collection.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
