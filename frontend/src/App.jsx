import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Box } from "@mui/material"; 
import "./App.css";


import Home from "./Pages/Homepage";
import {StoreProvider} from "./Context/shop-context";

import TeamIntro from "./Components/TeamIntro";
import CustomerProfile from "./Pages/CustomerProfile/customerProfile"; 
import Footer from "./Components/Footer"; 
import Basket from "./Pages/Basket/basket";

function App() {
  return (
    <StoreProvider> 
    <BrowserRouter>
      {/* Wrapper for Sticky Footer Layout*/}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh" 
        }}
      >
        
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-logo">App name</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/basket">Basket</Link>
            <Link to="/profile">Your Account</Link>
            <Link to="/about-us">About Us</Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* The Basket Route */}
            <Route path="/basket" element={<Basket />} />

            {/* The Profile Route */}
            <Route path="/profile" element={<CustomerProfile />} />

            <Route path="/about-us" element={<TeamIntro />} />
          </Routes>
        </Box>

        {/* The Footer */}
        <Footer />

      </Box>
    </BrowserRouter>
    </StoreProvider>
  );
}

export default App;