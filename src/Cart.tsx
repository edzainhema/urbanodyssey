import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import { X } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 500 }}>
          Your cart is empty
        </div>

        <button
          onClick={() => navigate("/")}
          style={button}
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>
          Cart
        </div>

        <button
          onClick={clearCart}
          style={clearButton}
        >
          Clear
        </button>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size ?? "nosize"}`}
            style={itemRow}
          >
            {/* Thumbnail */}
            <img
              src={item.thumbnail}
              alt={item.name}
              style={thumbnail}
            />

            {/* Info */}
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

            {/* Remove */}
            <button
              onClick={() =>
                removeFromCart(item.id, item.size ?? null)
              }
              style={removeButton}
              title="Remove item"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={footer}>
        <div style={{ fontSize: 16 }}>
          Total
        </div>

        <div style={{ fontSize: 18, fontWeight: 600 }}>
          ${total.toFixed(2)}
        </div>
      </div>

      <button
  onClick={() => navigate("/checkout")}
  style={{
    marginTop: 20,
    padding: "14px 28px",
    borderRadius: 30,
    background: "black",
    color: "white",
    border: "none",
  }}
>
  Proceed to Checkout
</button>

    </div>
  );
}

/* ----------------------------
   Styles
----------------------------- */

const container: React.CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: 16,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const thumbnail: React.CSSProperties = {
  width: 64,
  height: 80,
  objectFit: "cover",
};

const meta: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.7,
};

const removeButton: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  opacity: 0.6,
};

const footer: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24,
  marginBottom: 12,
};

const button: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 30,
  border: "1px solid black",
  background: "white",
  cursor: "pointer",
};

const checkoutButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: 30,
  border: "none",
  background: "black",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
};

const clearButton: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 13,
  opacity: 0.6,
  cursor: "pointer",
};
