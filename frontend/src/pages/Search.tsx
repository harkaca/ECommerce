import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

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

const Search: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter((product) => {
        return product.characteristics.some((char) => {
          return (
            char.name.toLowerCase().includes(searchValue) ||
            char.value.toLowerCase().includes(searchValue)
          );
        });
      });
      setFilteredProducts(filtered); 
    }
  };

  const filterByCategory = (categoryId: string | null) => {
    if (categoryId === null) {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter(
        (product) => product.category._id === categoryId
      );
      setFilteredProducts(filtered); 
    }
  };

  return (
    <div className="recommended-container">
        <Link to="/cart" >
                Go to Cart
              </Link>
              <Link to="/">
                      <button>go to Home</button>
                </Link>
                <Link to="/recommended">
                      <button>go to Recommended</button>
                </Link>
        
      <h2>Search Products</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search characteristics..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      

      {/* Displaying filtered products */}
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
        <p>No recommended products found based on your search.</p>
      )}

      
    </div>
  );
};

export default Search;
