import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import ProductList from "./pages/Home";
import Cart from "./pages/Cart"; 
import Recommended from "./pages/Recommended";
import Search from "./pages/Search";

const App: React.FC = () => {
  return (
    <Router> 
      <div>
        
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
