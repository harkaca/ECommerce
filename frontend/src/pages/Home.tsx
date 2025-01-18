import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string }; 
  characteristics: { _id: string; name: string }[];
  image?: string;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); 
      })
      .catch((err) => console.error("Error fetching products:", err));

    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        console.log("Categories:", data); 
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const filterByCategory = (categoryId: string | null) => {
    if (categoryId === null) {
      setFilteredProducts(products); 
    } else {
      console.log("Filtering by category ID:", categoryId);
      const filtered = products.filter((product) => {
        return String(product.category._id) === String(categoryId); 
      });
      setFilteredProducts(filtered);
    }
  };

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

  return (
    <div className="product-container">
        <Link to="/cart" >
        Go to Cart
      </Link>
      <Link to="/recommended">
              <button>go to recommended</button>
        </Link>
        <Link to="/search">
              <button>go to Search</button>
        </Link>
      <h2>Products</h2>

      <div>
        {filteredProducts.length > 0 ? (
          <div className="category-section">
            <div className="product-row">
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
                  <div className="characteristics">
                    <h4>Characteristics:</h4>
                    <ul>
                      {product.characteristics.map((char) => (
                        <li key={char._id}>{char.name}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock <= 0}
                  >
                    Add to Cart ({product.stock} left)
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No products found in this category</p>
        )}
      </div>

      
    </div>
  );
};

export default ProductList;
