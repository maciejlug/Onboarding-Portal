import { API_BASE_URL } from "../config/api";
import type {
  StartOnboardingPayload,
  StartOnboardingResponse,
} from "../types/onboarding";

export async function startOnboarding(
  payload: StartOnboardingPayload,
): Promise<StartOnboardingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/start/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirmPassword,
      accept_terms: payload.acceptTerms,
      accept_privacy_policy: payload.acceptPrivacyPolicy,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data) {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        throw new Error(String(firstError[0]));
      }
      if (typeof firstError === "string") {
        throw new Error(firstError);
      }
    }

    throw new Error("Could not start onboarding.");
  }

  return data as StartOnboardingResponse;
}
