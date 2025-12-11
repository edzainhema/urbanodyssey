import React from 'react';
import logo from './logo.svg';
import { Instagram, ShoppingBag } from "lucide-react";

import './App.css';


function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "25px", 
        marginBottom: "20px" 
      }}>
        
        <a
			href="https://www.instagram.com/theurban_odyssey/?hl=en"
			target="_blank"
			rel="noopener noreferrer"
		>
          <Instagram size={24} color="black" />
        </a>

        
        <a href="#" target="_blank" rel="noopener noreferrer">
          <ShoppingBag size={24} color="black" />
        </a>

      </div>
      <div style={{ fontSize: "25px", fontWeight:'600', marginTop: "20px", marginBottom: "20px" }}>
        Winter 2025 Collection
      </div>
     <div className="image-row">
    <img
      src="/image.png"
      alt="Urban Odyssey 1"
      style={{ width: "300px" }}
    />
    <img
      src="/image_two.png"
      alt="Urban Odyssey 2"
      style={{ width: "300px" }}
    />
    <img
      src="/image_three.png"
      alt="Urban Odyssey 3"
      style={{ width: "300px" }}
    />
  </div>
      <div style={{ fontSize: "35px", marginTop: "20px" }}>
        Urban Odyssey
      </div>
    </div>
  );
}

export default App;
