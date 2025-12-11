import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Box } from "@mui/material"; // 
import "./App.css";
import Home from "./Pages/Homepage";
import TeamIntro from "./Components/TeamIntro";
import Footer from "./Components/Footer"; // 

function App() {
  return (
    <BrowserRouter>
      {/* wrapped everything in this Box */}
      {/* This creates the sticky footer layout */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "100vh" 
        }}
      >
        
        {/*  Navbar */}
        <nav className="navbar">
          <div className="nav-logo">App name</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/basket">Basket</Link>
            <Link to="/profile">Your Account</Link>
            <Link to="/about-us">About Us</Link>
          </div>
        </nav>

        {/* Main Content Area - flexGrow pushes the footer down */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" />
            <Route path="/about-us" element={<TeamIntro />} />
          </Routes>
        </Box>

        {/* The Footer */}
        <Footer />

      </Box>
    </BrowserRouter>
  );
}

export default App;