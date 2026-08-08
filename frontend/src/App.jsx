import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import Home from "./Pages/Homepage";
import { StoreContextProvider } from "./Context/shop-context";
import TeamIntro from "./Components/TeamIntro";
import CustomerProfile from "./Pages/CustomerProfile/customerProfile";
import Footer from "./Components/Footer";
import Basket from "./Pages/Basket/basket";
import CheckoutPage from "./Pages/CheckoutPage";
import TermsOfService from "./Components/TermsOfService";
import PrivacyPolicy from "./Components/PrivacyPolicy";
function App() {
  return (
    <StoreContextProvider>
      <BrowserRouter>
        {/* Wrapper for Sticky Footer Layout*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Navbar */}
          <nav className="navbar">
            <div className="nav-logo" a href="/frontend/src/Pages/Homepage.jsx">Pickier</div>
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
              <Route path="/basket" element={<Basket />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/about-us" element={<TeamIntro />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </Box>
          {/* The Footer */}
          <Footer />
        </Box>
      </BrowserRouter>
    </StoreContextProvider>
  );
}
export default App;
