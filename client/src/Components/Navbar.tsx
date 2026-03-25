import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
      <Link to="/">Home</Link>
      <Link to="/onboarding">Onboarding</Link>
    </nav>
  );
}