import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

/* ----------------------------
   Types
----------------------------- */
type Item = {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
};

/* ============================
   AdminItems
============================= */
export default function AdminItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from("items")
        .select("id, name, price, image_urls")
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data);
      }

      setLoading(false);
    };

    fetchItems();
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
        Items
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate("/item", { state: { item } })
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
              src={item.image_urls[0]}
              alt={item.name}
              style={{
                width: 44,
                height: 56,
                objectFit: "cover",
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {item.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                }}
              >
                ${item.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
