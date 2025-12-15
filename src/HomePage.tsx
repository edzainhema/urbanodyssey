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
     Fetch data
  ----------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: collectionsData, error: collectionsError } =
        await supabase
          .from("collections")
          .select("id, name, image_urls, description, created_at")
          .order("created_at", { ascending: false });

      if (collectionsError || !collectionsData || collectionsData.length === 0) {
        console.error(collectionsError);
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
    return <div style={{ padding: 20 }}>Loading…</div>;
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
    gridTemplateColumns: "32px 1fr 32px", // icon | text | icon
    alignItems: "center",
    padding: "12px 14px",
  }}
>
  {/* Left icon */}
  <img
    src="/image_six.png"
    alt="Urban Odyssey"
    style={{
      width: 20,
      height: 20,
      justifySelf: "start",
    }}
  />

  {/* Brand text (left-aligned, slightly offset from icon) */}
  <div
    style={{
      fontSize: 18,
      fontWeight: 500,
      letterSpacing: "0.04em",
      justifySelf: "start",
      marginLeft: 8, // 👈 small, intentional offset
    }}
  >
    URBAN ODYSSEY
  </div>

  {/* Right icon */}
  <Instagram
    size={20}
    style={{ justifySelf: "end" }}
  />
</div>

		
		{/* COLLECTION IMAGES (HORIZONTAL EDITORIAL STRIP) */}
{latestCollection.image_urls.length > 0 && (
  <div
    className="hide-scrollbar"
    style={{
      display: "flex",
      gap: 8,
      padding: "0 10px 16px",
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


      
       {/* LATEST COLLECTION TITLE */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          margin: "0px 12px 6px",
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
            style={{ cursor: "pointer" }}
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
	
	 
     	
		
      {/* COLLECTION STRIP */}
<div
  style={{
    display: "flex",
    gap: 18,
    padding: "14px 12px",
    overflowX: "auto",
  }}
>
  {collections.map((collection) => {
    const isActive =
      latestCollection &&
      collection.id === latestCollection.id;

    return (
      <div
        key={collection.id}
        onClick={() => navigate(`/collections/${collection.id}`)}
        style={{
          cursor: "pointer",
          textAlign: "center",
          width: 80, // 👈 fixed width
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
            fontWeight: isActive ? 600 : 400, // 👈 bold active
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis", // 👈 ...
          }}
          title={collection.name} // optional: full name on hover
        >
          {collection.name}
        </div>
      </div>
    );
  })}
</div>
     
      {/* ADMIN (SUBTLE) */}
      <div
        style={{
          fontSize: 13,
          opacity: 0.5,
          padding: 12,
          textAlign: "left",
        }}
      >
        <div onClick={() => navigate("/create-item")}>Create Item</div>
        <div onClick={() => navigate("/create-collection")}>
          Create Collection
        </div>
      </div>
    </div>
  );
}
