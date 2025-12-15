import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "./cart/CartContext";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!
);

/* =========================
   PAGE
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
   FORM
========================= */
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: {
            name,
            address: {
              line1: address,
            },
          },
        },
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
    <form onSubmit={handleSubmit} style={container}>
      <h2 style={title}>Checkout</h2>

      {/* =========================
          CART ITEMS
      ========================= */}
      <div style={{ marginBottom: 24 }}>
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size ?? "nosize"}`}
            style={itemRow}
          >
            <img
              src={item.thumbnail}
              alt={item.name}
              style={thumbnail}
            />

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>
                {item.name}
              </div>

              {item.size && (
                <div style={meta}>
                  Size: {item.size}
                </div>
              )}

              <div style={meta}>
                ${item.price} × {item.quantity}
              </div>
            </div>

            <div style={{ fontWeight: 500 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          TOTAL
      ========================= */}
      <div style={totalRow}>
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* =========================
          CUSTOMER INFO
      ========================= */}
      <input
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        required
        placeholder="Shipping address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={input}
      />

      {/* =========================
          STRIPE PAYMENT
      ========================= */}
      <PaymentElement />

      <button
        disabled={!stripe || loading}
        style={button}
      >
        {loading ? "Processing…" : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

/* =========================
   STYLES
========================= */
const container: React.CSSProperties = {
  maxWidth: 420,
  margin: "30px auto",
  padding: "0 10px", // 👈 mobile edge spacing
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 20,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
};

const thumbnail: React.CSSProperties = {
  width: 56,
  height: 70,
  objectFit: "cover",
  borderRadius: 8,
};

const meta: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 24,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  marginBottom: 12,
  fontSize: 14,
  border: "none",
  borderRadius: 10,
  background: "rgb(240,240,240)",
  outline: "none",
};

const button: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 30,
  background: "black",
  color: "white",
  border: "none",
  marginTop: 20,
};
