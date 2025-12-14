import React, { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

import "./App.css";

/* ----------------------------
   Types
----------------------------- */
type Collection = {
  id: string;
  name: string;
  image_urls: string[];
  description: string | null;
  created_at: string;
};

type Item = {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
};

/* ============================
   HomePage
============================= */
export default function HomePage() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [latestCollection, setLatestCollection] = useState<Collection | null>(null);
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------
     Fetch collections + latest items
  ----------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1) Fetch all collections (newest first)
      const { data: collectionsData, error: collectionsError } =
        await supabase
          .from("collections")
          .select("id, name, image_urls, description, created_at")
          .order("created_at", { ascending: false });

      if (collectionsError || !collectionsData) {
        console.error(collectionsError);
        setLoading(false);
        return;
      }

      setCollections(collectionsData);

      if (collectionsData.length === 0) {
        setLoading(false);
        return;
      }

      // 2) Latest collection = first one
      const latest = collectionsData[0];
      setLatestCollection(latest);

      // 3) Fetch items for latest collection
      const { data: itemsData, error: itemsError } =
        await supabase
          .from("items")
          .select("id, name, price, image_urls")
          .eq("collection_id", latest.id);

      if (!itemsError && itemsData) {
        setLatestItems(itemsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* ----------------------------
     Loading / empty states
  ----------------------------- */
  if (loading) {
    return <div style={{ padding: 20 }}>Loading…</div>;
  }

  if (!latestCollection) {
    return <div style={{ padding: 20 }}>No collections yet.</div>;
  }

  /* ----------------------------
     UI
  ----------------------------- */
  return (
    <div style={{ textAlign: "center" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <img src="/image_six.png" style={{ width: 30 }} />
        <Instagram size={24} />
      </div>

      {/* COLLECTIONS STRIP */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "10px 10px 20px",
          overflowX: "auto",
        }}
      >
        {collections.map((collection) => (
          <div
            key={collection.id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/collections/${collection.id}`)}
          >
            <img
              src={collection.image_urls[0]}
              alt={collection.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: 30,
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
              }}
            />
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {collection.name}
            </div>
          </div>
        ))}
      </div>

      {/* LATEST COLLECTION */}
      <div style={{display:'flex', flexDirection:'row'}}>
      <img
              src={latestCollection.image_urls[0]}
              alt={latestCollection.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: 30,
                objectFit: "cover",
                display: "block",
				marginLeft:10,
              }}
            />
      <div
        style={{
          textAlign: "left",
          fontSize: 23,
          marginLeft: 10,
          marginBottom: 12,
        }}
      >
        {latestCollection.name}
      </div>
	</div>
      {/* COLLECTION IMAGES */}
      {latestCollection.image_urls.length > 0 && (
        <div className="image-row">
          {latestCollection.image_urls.map((url, i) => (
            <img key={i} src={url} style={{ width: 300 }} />
          ))}
        </div>
      )}

      {/* ITEMS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          padding: 16,
        }}
      >
        {latestItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 10,
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/item", { state: { item } })
            }
          >
            {item.image_urls.length > 0 && (
              <img
                src={item.image_urls[0]}
                alt={item.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              {item.name}
            </div>
            <div>${item.price}</div>
          </div>
        ))}
      </div>

      {/* ADMIN LINKS */}
      <div
        style={{ fontSize: 20, marginLeft: 10, textAlign: "left" }}
        onClick={() => navigate("/create-item")}
      >
        Create Item
      </div>

      <div
        style={{ fontSize: 20, marginLeft: 10, textAlign: "left" }}
        onClick={() => navigate("/create-collection")}
      >
        Create Collection
      </div>
    </div>
  );
}
