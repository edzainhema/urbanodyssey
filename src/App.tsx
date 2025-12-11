import React from 'react';
import logo from './logo.svg';
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { SiShopify } from "react-icons/si";

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
          <FaInstagram size={20} color="black" />
        </a>

        <a href="https://www.tiktok.com/@theurban_odyssey/video/7566878713829264647?q=the%20urban%20odyssey&t=1765431505718" target="_blank" rel="noopener noreferrer">
          <FaTiktok size={20} color="black" />
        </a>

        <a href="#" target="_blank" rel="noopener noreferrer">
          <SiShopify size={20} color="black" />
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
