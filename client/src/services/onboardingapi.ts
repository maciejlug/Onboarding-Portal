import { API_BASE_URL } from "../config/api";
import { ensureCsrfCookie, getCookie } from "./csrf";

export type StartOnboardingPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
};

export async function startOnboarding(payload: StartOnboardingPayload) {
  await ensureCsrfCookie();

  const response = await fetch(`${API_BASE_URL}/api/onboarding/start/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
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
    const firstError = data ? Object.values(data)[0] : null;

    if (Array.isArray(firstError) && firstError.length > 0) {
      throw new Error(String(firstError[0]));
    }

    if (typeof firstError === "string") {
      throw new Error(firstError);
    }

    throw new Error("Could not start onboarding.");
  }

  return data;
}

export async function getOnboardingMe() {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not fetch onboarding data.");
  }

  return response.json();
}

export async function updateOnboardingMe(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/me/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const firstError = data ? Object.values(data)[0] : null;

    if (Array.isArray(firstError) && firstError.length > 0) {
      throw new Error(String(firstError[0]));
    }

    if (typeof firstError === "string") {
      throw new Error(firstError);
    }

    throw new Error("Could not update onboarding.");
  }

  return data;
}
