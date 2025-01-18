import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Recommended.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string }; 
  characteristics: { _id: string; name: string; value: string }[];
  image?: string;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
}

const Recommended: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCharacteristics, setCartCharacteristics] = useState<
    { name: string; value: string }[]
  >([]);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); 
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/cart", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const characteristics = data.map((item: any) => item.product.characteristics).flat();
        setCartCharacteristics(characteristics);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);


  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product to cart");
      }

      alert("Product added to cart!");
      
      window.location.reload();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  
  const filterByCartCharacteristics = () => {
    if (cartCharacteristics.length === 0) {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter((product) => {
        return product.characteristics.some((char) => {
          return cartCharacteristics.some((cartChar) => {
            return (
              char.name === cartChar.name && char.value === cartChar.value
            );
          });
        });
      });
      setFilteredProducts(filtered); 
    }
  };

  useEffect(() => {
    filterByCartCharacteristics();
  }, [cartCharacteristics, products]);

  return (
    <div className="recommended-container">
        <Link to="/cart" >
                        Go to Cart
                      </Link>
                      <Link to="/">
                              <button>go to Home</button>
                        </Link>
                        <Link to="/search">
                              <button>go to Search</button>
                        </Link>
      <h2>Recommended Products</h2>

      {filteredProducts.length > 0 ? (
        <div className="recommended-products">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>${product.price}</strong>
              </p>
              <p>Stock: {product.stock}</p>
              <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock <= 0}
                  >
                    Add to Cart ({product.stock} left)
                  </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommended products found based on your cart.</p>
      )}
    </div>
  );
};

export default Recommended;
