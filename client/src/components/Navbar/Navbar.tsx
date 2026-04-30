import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/authContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Navbar() {
  const { user } = useAuth();

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
            {user.isAuthenticated ? (
              <Typography color="white">{user.email}</Typography>
            ) : (
              <>
                <Button color="inherit">Login</Button>
                <Button variant="contained">Register</Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
