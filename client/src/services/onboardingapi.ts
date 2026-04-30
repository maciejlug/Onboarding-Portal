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

export async function checkEmailAvailability(email: string) {
  const params = new URLSearchParams({ email });

  const response = await fetch(
    `${API_BASE_URL}/api/onboarding/check-email/?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error("Could not validate email.");
  }

  return data as { email: string; is_taken: boolean };
}

export async function finishOnboarding() {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/finish/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Could not finish onboarding.");
  }

  return data as {
    message: string;
    status: string;
    is_email_verified: boolean;
  };
}

export async function verifyEmail(token: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/onboarding/verify-email/?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Could not verify email.");
  }

  return data as { message: string; is_email_verified: boolean };
}

export async function resendVerificationEmail() {
  const response = await fetch(
    `${API_BASE_URL}/api/onboarding/resend-verification-email/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Could not resend verification email.");
  }

  return data as { message: string };
}
