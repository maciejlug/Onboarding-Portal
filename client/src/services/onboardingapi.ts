import type { OnboardingSession, CreateOnboardingSessionPayload } from "../types/onboarding";
import { API_BASE_URL } from "../config/api";

export async function getOnboardingSessions(): Promise<OnboardingSession[]> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/`);

  if (!response.ok) {
    throw new Error("Failed to fetch onboarding sessions");
  }

  return response.json();
}

export async function createOnboardingSession(
  payload: CreateOnboardingSessionPayload
): Promise<OnboardingSession> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create onboarding session");
  }

  return response.json();
}