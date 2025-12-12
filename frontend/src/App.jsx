import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Homepage";
import TeamIntro from "./Components/TeamIntro";
import CustomerProfile from "./Pages/CustomerProfile/customerProfile";


function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-logo">App name</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/basket">Basket</Link>
          <Link to="/profile">Your Account</Link>
          <Link to="/about-us">About Us</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/about-us" element={<TeamIntro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;