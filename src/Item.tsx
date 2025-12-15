import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "./cart/CartContext";

/* ----------------------------
   Types
----------------------------- */
type ItemType = {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
  sizes?: string[];
};

export default function Item() {
  const location = useLocation();
  const item = (location.state as { item: ItemType } | null)?.item;
  const { addToCart, removeFromCart, cart } = useCart();



	
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

	useEffect(() => {
  console.log("Item page loaded with item:", item);
}, [item]);


  if (!item) {
    return <div>Item not found</div>;
  }
  
  
  	const isInCart = cart.some(
  (cartItem) =>
    cartItem.id === item.id &&
    cartItem.size === (selectedSize ?? null)
);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {/* Images */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
        {item.image_urls.map((img: string, i: number) => (
          <img
            key={i}
            src={img}
            alt={item.name}
            style={{
              width: 280,
              height: 350,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        ))}
      </div>

      {/* Item Info */}
      <div style={{ marginTop: 24, textAlign: "left" }}>
        <div style={{ fontSize: 32, fontWeight: 500 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 20, marginTop: 8 }}>
          ${item.price}
        </div>
      </div>

      {/* Size selection (only if sizes exist) */}
      {item.sizes && (
        <div style={{ marginTop: 18, textAlign: "left" }}>

          <div style={{ display: "flex", gap: 12 }}>
            {item.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 20,
                  border: "1px solid black",
                  background:
                    selectedSize === size ? "black" : "white",
                  color:
                    selectedSize === size ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buy button */}
     <button
  disabled={item.sizes && !selectedSize}
  onClick={() => {
    if (isInCart) {
      removeFromCart(item.id, selectedSize ?? null);
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      thumbnail: item.image_urls[0],
      size: selectedSize ?? null,
      quantity: 1,
    });
  }}
  style={{
    marginTop: 32,
    padding: "14px 28px",
    fontSize: 16,
    borderRadius: 30,
    border: "none",
    cursor:
      item.sizes && !selectedSize ? "not-allowed" : "pointer",
    background: isInCart ? "#e5e5e5" : "black",
    color: isInCart ? "#555" : "white",
    transition: "all 0.15s ease",
  }}
>
  {isInCart
    ? "Remove from Cart"
    : item.sizes
    ? selectedSize
      ? `Add to Cart (${selectedSize})`
      : "Select a size"
    : "Add to Cart"}
</button>



    </div>
  );
}
