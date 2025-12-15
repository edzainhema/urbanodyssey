import React from "react";
import { useNavigate } from "react-router-dom";

/* ============================
   Admin
============================= */
export default function Admin() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 16px",
      }}
    >
      {/* TITLE */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          marginBottom: 24,
        }}
      >
        Admin
      </div>

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Create */}
        <button
          onClick={() => navigate("/create-item")}
          style={buttonStyle}
        >
          + Create Item
        </button>

        <button
          onClick={() => navigate("/create-collection")}
          style={buttonStyle}
        >
          + Create Collection
        </button>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#eee",
            margin: "10px 0",
          }}
        />

        {/* View */}
        <button
          onClick={() => navigate("/admin/items")}
          style={buttonStyle}
        >
          View Items
        </button>

        <button
          onClick={() => navigate("/admin/collections")}
          style={buttonStyle}
        >
          View Collections
        </button>
      </div>
    </div>
  );
}

/* ----------------------------
   Styles
----------------------------- */
const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  textAlign: "left",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};
