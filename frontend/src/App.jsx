import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import pickierTheme from "./pickierTheme";
import "./App.css";
import Home from "./Pages/Homepage";
import { StoreContextProvider, StoreContext } from "./Context/shop-context";
import TeamIntro from "./Components/TeamIntro";
import CustomerProfile from "./Pages/CustomerProfile/customerProfile";
import Footer from "./Components/Footer";
import Basket from "./Pages/Basket/basket";
import CheckoutPage from "./Pages/CheckoutPage";
import TermsOfService from "./Components/TermsOfService";
import PrivacyPolicy from "./Components/PrivacyPolicy";

const navLinkClass = ({ isActive }) => (isActive ? "active" : undefined);

function NavBasketCount() {
  const { basketItems, demoCustomLines } = useContext(StoreContext);
  const count = Object.values(basketItems || {}).reduce((a, b) => a + b, 0)
    + Object.values(demoCustomLines || {}).reduce((a, line) => a + line.quantity, 0);
  if (!count) return null;
  return <span className="nav-basket-count">{count}</span>;
}

function App() {
  return (
    <ThemeProvider theme={pickierTheme}>
      <StoreContextProvider>
        <BrowserRouter>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <nav className="navbar" aria-label="Main navigation">
              <Link to="/" className="nav-logo-group" aria-label="Pickier home">
                <span className="nav-logo">pickier<span className="nav-logo-dot">.</span></span>
              </Link>
              <div className="nav-links">
                <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                <NavLink to="/about-us" className={navLinkClass}>About</NavLink>
                <NavLink to="/profile" className={navLinkClass}>Account</NavLink>
                <NavLink to="/basket" className={navLinkClass}>Basket <NavBasketCount /></NavLink>
              </div>
            </nav>
            <Box component="main" className="pk-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/basket" element={<div className="pk-legacy-route"><Basket /></div>} />
                <Route path="/checkout" element={<div className="pk-legacy-route"><CheckoutPage /></div>} />
                <Route path="/profile" element={<div className="pk-legacy-route"><CustomerProfile /></div>} />
                <Route path="/about-us" element={<div className="pk-legacy-route"><TeamIntro /></div>} />
                <Route path="/terms" element={<div className="pk-legacy-route"><TermsOfService /></div>} />
                <Route path="/privacy" element={<div className="pk-legacy-route"><PrivacyPolicy /></div>} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </StoreContextProvider>
    </ThemeProvider>
  );
}
export default App;
