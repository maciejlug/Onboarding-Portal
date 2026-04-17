import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="page-width">
        <div className="navbar">
          <div className="navbar__left">
            <div className="navbar__brand">
              <Link to="/">Onboarding Portal</Link>
            </div>
            <nav className="navbar__nav">
              <Link to="/">Home</Link>
            </nav>
          </div>
          <nav className="navbar__auth">
            <Link to="/login">Login</Link>
            <Link to="/onboarding" className="button-link">
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
