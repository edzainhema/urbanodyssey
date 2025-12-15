import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "./cart/CartContext";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!
);

/* =========================
   TOP-LEVEL PAGE COMPONENT
========================= */
export default function Checkout() {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    async function createIntent() {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
        }),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
    }

    if (total > 0) createIntent();
  }, [total]);

  if (!clientSecret) {
    return <div style={{ padding: 40 }}>Loading payment…</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}

/* =========================
   FORM COMPONENT
========================= */
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
      return;
    }

    clearCart();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 420, margin: "40px auto" }}
    >
      <h2>Checkout</h2>

      <PaymentElement />

      <button
        disabled={!stripe || loading}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 30,
          background: "black",
          color: "white",
          border: "none",
          marginTop: 20,
        }}
      >
        {loading ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}
