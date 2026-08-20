import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { Box } from "@mui/material";
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
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderTracking from "./Pages/OrderTracking";

const navLinkClass = ({ isActive }) => (isActive ? "active" : undefined);

function ChiliMascot() {
  return (
    <svg className="nav-icon" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="var(--mustard)" stroke="var(--espresso)" strokeWidth="3" />
      <g transform="rotate(-8 20 20)">
        <path
          d="M14 27 C10 23 10 15 15 11 C19 8 24 9 25 12 C26 15 23 17 21 19 C18 22 18 25 20 28 C17 30 16 29 14 27 Z"
          fill="var(--chili)" stroke="var(--espresso)" strokeWidth="1.5" strokeLinejoin="round"
        />
        <path
          d="M22 11 C23 9 25 8 27 9 C26 11 24 12 22 11 Z"
          fill="var(--basil)" stroke="var(--espresso)" strokeWidth="1.2" strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function NavBasketCount() {
  const { basketItems } = useContext(StoreContext);
  const count = Object.values(basketItems || {}).reduce((a, b) => a + b, 0);
  if (!count) return null;
  return <span className="nav-basket-count">{count}</span>;
}

function App() {
  return (
    <StoreContextProvider>
      <BrowserRouter>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <nav className="navbar">
            <Link to="/" className="nav-logo-group">
              <ChiliMascot />
              <span className="nav-logo">Pickier</span>
            </Link>
            <div className="nav-links">
              <NavLink to="/" className={navLinkClass} end>Home</NavLink>
              <NavLink to="/basket" className={navLinkClass}>
                Basket <NavBasketCount />
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>Your account</NavLink>
              <NavLink to="/about-us" className={navLinkClass}>About us</NavLink>
            </div>
          </nav>

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/about-us" element={<TeamIntro />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </BrowserRouter>
    </StoreContextProvider>
  );
}
export default App;
