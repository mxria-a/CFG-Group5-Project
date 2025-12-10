import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Homepage";
import TeamIntro from "./Components/TeamIntro";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/basket">Basket</Link>
        <Link to="/profile">Your Account</Link>
        <Link to="/about-us">About Us</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" />
        <Route path="/about-us" element={<TeamIntro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
