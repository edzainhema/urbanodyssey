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
  const [latestCollection, setLatestCollection] =
    useState<Collection | null>(null);
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  /* ----------------------------
     Fetch data
  ----------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: collectionsData, error } = await supabase
        .from("collections")
        .select("id, name, image_urls, description, created_at")
        .order("created_at", { ascending: false });

      if (error || !collectionsData || collectionsData.length === 0) {
        console.error(error);
        setLoading(false);
        return;
      }

      setCollections(collectionsData);

      const latest = collectionsData[0];
      setLatestCollection(latest);

      const { data: itemsData } = await supabase
        .from("items")
        .select("id, name, price, image_urls")
        .eq("collection_id", latest.id);

      if (itemsData) {
        setLatestItems(itemsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  /* ----------------------------
     States
  ----------------------------- */
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
      <img
        src="/image_six.png"
        alt="Urban Odyssey"
        style={{
          width: 40,
          height: 40,
          opacity: 0.9,
        }}
      />
    </div>
  );
}


  if (!latestCollection) {
    return (
      <div style={{ padding: 20 }}>
        <p>No collections yet.</p>
        <button onClick={() => navigate("/create-collection")}>
          Create Collection
        </button>
      </div>
    );
  }

  /* ----------------------------
     UI
  ----------------------------- */
  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 32px",
          alignItems: "center",
          padding: "12px 14px",
        }}
      >
        <img
          src="/image_six.png"
          alt="Urban Odyssey"
          style={{ width: 20, height: 20 }}
        />

        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.04em",
            marginLeft: 8,
          }}
        >
          URBAN ODYSSEY
        </div>

        <Instagram size={20} />
      </div>

      {/* COLLECTION IMAGES (EDITORIAL STRIP) */}
      {latestCollection.image_urls.length > 0 && (
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 8,
            padding: "0 10px 18px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {latestCollection.image_urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={latestCollection.name}
              style={{
                width: 250,
                height: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* COLLECTION TITLE (CAPTION STYLE) */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          margin: "8px 12px 6px",
          textAlign: "left",
          letterSpacing: "0.02em",
        }}
      >
        {latestCollection.name}
      </div>

      {/* ITEMS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14,
          padding: "10px",
        }}
      >
        {latestItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate("/item", { state: { item } })}
            style={{
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.opacity = "0.6")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            <img
              src={item.image_urls[0]}
              alt={item.name}
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontSize: 13,
                opacity: 0.8,
              }}
            >
              ${item.price}
            </div>
          </div>
        ))}
      </div>

      {/* COLLECTION STRIP (NAVIGATION) */}
      <div
        className="hide-scrollbar"
        style={{
          display: "none",
          gap: 16,
          padding: "12px",
          overflowX: "auto",
        }}
      >
        {collections.map((collection) => {
          const isActive =
            collection.id === latestCollection.id;

          return (
            <div
              key={collection.id}
              onClick={() =>
                navigate(`/collections/${collection.id}`)
              }
              style={{
                cursor: "pointer",
                textAlign: "center",
                width: 60,
                flexShrink: 0,
              }}
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

              <div
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={collection.name}
              >
                {collection.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADMIN (BACKSTAGE) */}
      <div
        style={{
          fontSize: 12,
          opacity: 0.35,
          padding: "8px 12px 20px",
          textAlign: "left",
        }}
      >
        <div onClick={() => navigate("/admin")}>
          Admin
        </div>
       
      </div>
    </div>
  );
}
