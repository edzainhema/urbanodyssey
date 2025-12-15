import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Routes, Route } from "react-router-dom";

import { CartProvider } from "./cart/CartContext";

import HomePage from "./HomePage";
import Item from "./Item";
import CreateItem from "./CreateItem";
import CreateCollection from "./CreateCollection";
import CollectionPage from "./Collection";
import Admin from "./Admin";
import AdminItems from "./AdminItems";
import AdminCollections from "./AdminCollections";
import EditItem from "./EditItem";
import EditCollection from "./EditCollection";
import Cart from "./Cart";
import Checkout from "./Checkout";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!
);

function App() {
  return (
    <CartProvider>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/item" element={<Item />} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/create-collection" element={<CreateCollection />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
		  <Route path="/cart" element={<Cart />} />
	       <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/items" element={<AdminItems />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/items/:id/edit" element={<EditItem />} />
          <Route path="/admin/collections/:id/edit" element={<EditCollection />} />
        </Routes>
      </Elements>
    </CartProvider>
  );
}

export default App;
