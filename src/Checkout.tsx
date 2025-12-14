import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/create-payment-intent", {
		method: "POST",
	});

    const { clientSecret } = await res.json();

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements!.getElement(CardElement)!,
      },
    });

    if (result?.paymentIntent?.status === "succeeded") {
      alert("Payment successful!");
    }
  };

  return (
    <form onSubmit={handlePay} style={{ maxWidth: 400, marginTop: 20 }}>
      <CardElement />
      <button
        type="submit"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </form>
  );
}
