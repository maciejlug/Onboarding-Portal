import type { OnboardingSession } from "../types/onboarding";
import { API_BASE_URL } from "../config/api";

export async function getOnboardingSessions(): Promise<OnboardingSession[]> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/`);

  if (!response.ok) {
    throw new Error("Failed to fetch onboarding sessions");
  }

  return response.json();
}