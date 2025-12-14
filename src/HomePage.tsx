import React from "react";
import { Instagram, ShoppingBag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Checkout";
import Item from "./Item";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";



export default function HomePage() {
  const navigate = useNavigate();

  const item = {
    id: "hoodie-001",
    name: "Urban Odyssey Hoodie",
    price: 120,
    images: ["/image.png", "/image_two.png", "/image_three.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
        <img src="/image_six.png" style={{ width: 30 }} />
        <Instagram size={24} />
      </div>

      {/* COLLECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 23,
          marginLeft: 10,
          cursor: "pointer",
        }}
        onClick={() => navigate("/item", { state: { item } })}
      >
        <img src="/image.png" style={{ width: 25 }} />
        Winter 2025 Collection
      </div>

      {/* IMAGES */}
      <div className="image-row">
        <img src="/image.png" style={{ width: 300 }} />
        <img src="/image_two.png" style={{ width: 300 }} />
        <img src="/image_three.png" style={{ width: 300 }} />
      </div>

      <div 
		style={{ fontSize: 35, marginLeft: 10, textAlign: "left" }}
		onClick={() => navigate("/create-collection",)}
	>
        
		Urban Odyssey
      </div>

      <div style={{ marginLeft: 10, textAlign: "left" }}>
        <Checkout />
      </div>
    </div>
  );
}
