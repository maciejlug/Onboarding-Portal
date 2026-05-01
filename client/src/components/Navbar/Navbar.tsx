import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import "./Navbar.css";
import { useAuth } from "../../context/authContext";
import { logoutUser } from "../../services/authApi";

export default function Navbar() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  function handleOpenMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
      await refreshUser();
      navigate("/");
      handleCloseMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

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
              <>
                <Button
                  type="button"
                  onClick={handleOpenMenu}
                  disabled={isLoggingOut}
                  sx={{
                    textTransform: "none",
                    color: "white",
                  }}
                >
                  {user.email}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/onboarding" className="button-link">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
