import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="pk-footer">
      <div className="pk-footer-inner">
        <div>
          <Link to="/" className="nav-logo-group" aria-label="Pickier home">
            <span className="nav-logo">pickier<span className="nav-logo-dot">.</span></span>
          </Link>
          <p>Less searching. More eating.</p>
        </div>
        <div className="pk-footer-note">
          <nav className="pk-footer-links" aria-label="Footer navigation">
            <Link to="/about-us">About</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
          <span>A portfolio project. Sample illustrations are for demonstration.</span>
        </div>
      </div>
    </footer>
  );
}
