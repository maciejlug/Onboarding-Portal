import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to the Onboarding Portal</h1>
        <p>
          Manage onboarding sessions, track progress, and build a better user
          registration flow.
        </p>

        <div className="hero__actions">
          <Link to="/onboarding" className="button-link">
            Register account
          </Link>
        </div>
      </section>
    </div>
  );
}