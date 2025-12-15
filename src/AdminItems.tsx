import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { Trash2, Edit } from "lucide-react";
import { logAdminAction } from "./lib/logAdminAction";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("items")
      .select("id, name, price, image_urls")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
	  const confirmed = window.confirm(
	    "Are you sure you want to delete this item?"
	  );
	
	  if (!confirmed) return;
	
	  const { error } = await supabase
	    .from("items")
	    .delete()
	    .eq("id", id);
	
	  if (error) {
	    alert(error.message);
	    return;
	  }
		
	const timestamp = new Date().toLocaleString();
		
	 await logAdminAction(
	    "Item deleted",
	    `Item "${name}" was deleted on ${timestamp}`
	  );
	
	  setItems((prev) => prev.filter((i) => i.id !== id));
	};


  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
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
      <h2 style={title}>Items</h2>

      {/* SEARCH */}
      <input
        placeholder="Search items"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {/* GRID */}
      <div style={grid}>
        {filteredItems.map((item) => (
          <div key={item.id} style={card}>
            <img
              src={item.image_urls[0]}
              alt={item.name}
              style={image}
              onClick={() =>
                navigate("/item", { state: { item } })
              }
            />

            <div style={name}>{item.name}</div>
            <div style={price}>${item.price}</div>

            {/* ACTIONS */}
            <div style={actions}>
              <Edit
                size={16}
                onClick={() =>
                  navigate(`/admin/items/${item.id}/edit`)
                }
                style={icon}
              />
              <Trash2
                size={16}
                onClick={() => handleDelete(item.id, item.name)}
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
   Styles
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
const price = { fontSize: 13, opacity: 0.7 };

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
