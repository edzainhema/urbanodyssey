import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

/* ----------------------------
   Types
----------------------------- */
type Collection = {
  id: string;
  name: string;
  description: string | null;
  image_urls: string[];
};

type Item = {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
};

/* ============================
   Collection Page
============================= */
export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------
     Fetch collection + items
  ----------------------------- */
  useEffect(() => {
    if (!id) return;

    const fetchCollectionData = async () => {
      setLoading(true);

      // 1) Fetch collection
      const { data: collectionData, error: collectionError } =
        await supabase
          .from("collections")
          .select("id, name, description, image_urls")
          .eq("id", id)
          .single();

      if (collectionError) {
        console.error(collectionError);
        setLoading(false);
        return;
      }

      setCollection(collectionData);

      // 2) Fetch items in this collection
      const { data: itemsData, error: itemsError } =
        await supabase
          .from("items")
          .select("id, name, price, image_urls")
          .eq("collection_id", id);

      if (!itemsError && itemsData) {
        setItems(itemsData);
      }

      setLoading(false);
    };

    fetchCollectionData();
  }, [id]);

  /* ----------------------------
     Loading / empty states
  ----------------------------- */
  if (loading) {
    return <div style={{ padding: 20 }}>Loading collection…</div>;
  }

  if (!collection) {
    return <div style={{ padding: 20 }}>Collection not found</div>;
  }

  /* ----------------------------
     UI
  ----------------------------- */
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      {/* Collection Images */}
      {collection.image_urls.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            marginBottom: 24,
          }}
        >
          {collection.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={collection.name}
              style={{
                height: 300,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      )}

      {/* Name + Description */}
      <h1 style={{ marginBottom: 8 }}>{collection.name}</h1>
      {collection.description && (
        <p style={{ marginBottom: 32 }}>{collection.description}</p>
      )}

      {/* Items */}
      <h2 style={{ marginBottom: 16 }}>Items</h2>

      {items.length === 0 ? (
        <p>No items in this collection yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
              }}
            >
              {item.image_urls.length > 0 && (
                <img
                  src={item.image_urls[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
              )}

              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ marginTop: 4 }}>${item.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
