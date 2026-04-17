import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  createOnboardingSession,
  getOnboardingSessions,
} from "../../services/onboardingApi";
import type { OnboardingSession } from "../../types/onboarding";

export default function OnboardingPage() {
  const [sessions, setSessions] = useState<OnboardingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState("draft");
  const [accountType, setAccountType] = useState("individual");

  async function loadSessions() {
    try {
      setError("");
      const data = await getOnboardingSessions();
      setSessions(data);
    } catch {
      setError("Could not load onboarding sessions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const newSession = await createOnboardingSession({
        status,
        account_type: accountType,
      });

      setSessions((prevSessions) => [newSession, ...prevSessions]);
      setStatus("draft");
      setAccountType("individual");
    } catch {
      setError("Could not create onboarding session.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Onboarding</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="draft">draft</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="accountType">Account type</label>
          <br />
          <select
            id="accountType"
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
          >
            <option value="individual">individual</option>
            <option value="company">company</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create session"}
        </button>
      </form>

      {loading && <p>Loading onboarding sessions...</p>}
      {!loading && error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {sessions.length === 0 ? (
            <p>No onboarding sessions yet.</p>
          ) : (
            <ul>
              {sessions.map((session) => (
                <li key={session.id}>
                  #{session.id} - {session.status} - {session.account_type}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}