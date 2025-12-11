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
      <img 
        src="/image.png" 
        alt="Urban Odyssey" 
        style={{ width: "300px" }} 
      />
      <div style={{ fontSize: "35px", marginTop: "20px" }}>
        Urban Odyssey
      </div>
    </div>
  );
}

export default App;
