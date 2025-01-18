import React, { useState, useEffect } from "react";
import { CartItem } from "../types/cartItem"; 
import { Link } from "react-router-dom";



interface CheckoutResponse {
  approvalUrl: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 

  useEffect(() => {
    fetch("http://localhost:5000/api/cart", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setCartItems(data.products);
        } else {
          console.error("Cart is empty or invalid response", data);
        }
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        alert("No items in the cart!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/checkout/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initiate checkout");
      }

      const { approvalUrl }: CheckoutResponse = await response.json();

      window.location.href = approvalUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to remove product from cart");

      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.productId._id !== productId)
      );

      window.location.reload(); 
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div>
        <Link to="/" >
        Go to Home
      </Link>
      <Link to="/recommended">
              <button>Go to recommended</button>
        </Link>
        <Link to="/search">
              <button>Search</button>
        </Link>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}
            >
              <p>
                {item.productId.name} - {item.quantity} pcs - ${item.productId.price * item.quantity}
              </p>
              <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          
          
        </div>
      )}
    </div>
  );
};

export default Cart;
