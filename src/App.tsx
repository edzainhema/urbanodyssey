import React from 'react';
import logo from './logo.svg';
import { Instagram, ShoppingBag, Search } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./Checkout";
import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import Item from "./Item";
import CreateItem from "./CreateItem";
import CreateCollection from "./CreateCollection";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!
);

function App() {
	return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item" element={<Item />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/create-collection" element={<CreateCollection />} />
      </Routes>
    </Elements>
  );
}

export default App;
