import { useEffect, useState } from "react";
import { getOnboardingSessions } from "../services/onboardingapi";
import type { OnboardingSession } from "../types/onboarding";

export default function OnboardingPage() {
  const [sessions, setSessions] = useState<OnboardingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    useEffect(() => {
    async function loadSessions() {
      try {
        const data = await getOnboardingSessions();
        setSessions(data);
      } catch{
        setError("Could not load onboarding sessions.");
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  console.log(sessions)
  console.log(loading)
  console.log(error)
  return (
    <div>
      <h1>Onboarding</h1>
      <p>This is the onboarding page.</p>
    </div>
  );
}
