import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useCart } from "./cart/CartContext";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ----------------------------
     Create Payment Intent
  ----------------------------- */
  useEffect(() => {
  console.log("🧾 Cart contents:", cart);
  console.log("💰 Total amount:", totalAmount);

  if (totalAmount <= 0) {
    console.warn("⚠️ Total amount is 0 — not creating payment intent");
    return;
  }

  console.log("➡️ Creating payment intent...");

  fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Math.round(totalAmount * 100),
    }),
  })
    .then(async (res) => {
      console.log("⬅️ Payment intent response status:", res.status);

      const text = await res.text();
      console.log("⬅️ Raw response:", text);

      try {
        const data = JSON.parse(text);
        return data;
      } catch (err) {
        throw new Error("Response is not valid JSON");
      }
    })
    .then((data) => {
      console.log("✅ Parsed response:", data);

      if (!data.clientSecret) {
        console.error("❌ No clientSecret returned:", data);
        return;
      }

      setClientSecret(data.clientSecret);
    })
    .catch((err) => {
      console.error("🔥 Failed to create payment intent:", err);
    });
}, [totalAmount]);


  /* ----------------------------
     Submit
  ----------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("🟢 Submitting payment");
  console.log("Name:", name);
  console.log("Address:", address);
  console.log("Stripe loaded:", !!stripe);
  console.log("Elements loaded:", !!elements);

  if (!stripe || !elements) {
    console.warn("⚠️ Stripe or Elements not ready");
    return;
  }

  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      payment_method_data: {
        billing_details: {
          name,
          address: { line1: address },
        },
      },
      return_url: window.location.origin + "/success",
    },
  });

  setLoading(false);

  if (error) {
    console.error("❌ Stripe confirmPayment error:", error);
  } else {
    console.log("✅ Payment confirmed");
    clearCart();
  }
};

	console.log("🔐 Stripe loaded:", !!stripe);
  console.log("🧩 Elements loaded:", !!elements);
  console.log("🔑 Client secret:", clientSecret);
  
  if (!clientSecret) {
    return <div style={{ padding: 20 }}>Loading payment…</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
      }}
    >
      <h2>Checkout</h2>

      {/* Name */}
      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
        required
      />

      {/* Address */}
      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={input}
        required
      />

      {/* Stripe Payment UI */}
      <PaymentElement />

      <button
        disabled={!stripe || loading}
        style={button}
      >
        {loading
          ? "Processing…"
          : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}

/* ----------------------------
   Styles
----------------------------- */
const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const button: React.CSSProperties = {
  marginTop: 20,
  padding: "14px 16px",
  borderRadius: 30,
  border: "none",
  background: "black",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
};
