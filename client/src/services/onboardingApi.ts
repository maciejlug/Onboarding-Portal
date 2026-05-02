import { API_BASE_URL } from "../config/api";
import { ensureCsrfCookie, getCookie } from "./csrf";

export type StartOnboardingPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
};

export type OnboardingStatus = "in_progress" | "completed";

export type OnboardingMeResponse = {
  status: OnboardingStatus;
  current_step: number;
  is_email_verified: boolean;

  email?: string;

  accept_terms?: boolean;
  accept_privacy_policy?: boolean;

  first_name?: string;
  last_name?: string;
  gender?: string;
  country_of_birth?: string;
  date_of_birth?: string;

  phone?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
};
export function getJsonCsrfHeaders(): Headers {
  const headers = new Headers();

  headers.set("Content-Type", "application/json");

  const csrfToken = getCookie("csrftoken");

  if (csrfToken) {
    headers.set("X-CSRFToken", csrfToken);
  }
  console.log({ headers });
  return headers;
}

function getFirstApiError(data: unknown, fallbackMessage: string) {
  if (!data || typeof data !== "object") {
    return fallbackMessage;
  }

  const values = Object.values(data as Record<string, unknown>);
  const firstError = values[0];

  if (Array.isArray(firstError) && firstError.length > 0) {
    return String(firstError[0]);
  }

  if (typeof firstError === "string") {
    return firstError;
  }

  if (
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }

  return fallbackMessage;
}

export async function startOnboarding(payload: StartOnboardingPayload) {
  await ensureCsrfCookie();

  const response = await fetch(`${API_BASE_URL}/api/onboarding/start/`, {
    method: "POST",
    credentials: "include",
    headers: getJsonCsrfHeaders(),
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
    throw new Error(getFirstApiError(data, "Could not start onboarding."));
  }

  return data;
}

export async function getOnboardingMe(): Promise<OnboardingMeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/me/`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getFirstApiError(data, "Could not fetch onboarding data."));
  }

  return data as OnboardingMeResponse;
}

export async function updateOnboardingMe(payload: Record<string, unknown>) {
  await ensureCsrfCookie();
  console.log(getJsonCsrfHeaders(), "update");
  const response = await fetch(`${API_BASE_URL}/api/onboarding/me/`, {
    method: "PATCH",
    credentials: "include",
    headers: getJsonCsrfHeaders(),
    body: JSON.stringify(payload),
  });
  console.log({ response });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getFirstApiError(data, "Could not update onboarding."));
  }

  return data as OnboardingMeResponse;
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
    throw new Error(getFirstApiError(data, "Could not validate email."));
  }

  return data as { email: string; is_taken: boolean };
}

export async function finishOnboarding() {
  await ensureCsrfCookie();

  const response = await fetch(`${API_BASE_URL}/api/onboarding/finish/`, {
    method: "POST",
    credentials: "include",
    headers: getJsonCsrfHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getFirstApiError(data, "Could not finish onboarding."));
  }

  return data as {
    message?: string;
    detail?: string;
    status: OnboardingStatus;
    is_email_verified: boolean;
  };
}

export async function verifyEmail(token: string) {
  const params = new URLSearchParams({ token });

  const response = await fetch(
    `${API_BASE_URL}/api/onboarding/verify-email/?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getFirstApiError(data, "Could not verify email."));
  }

  return data as {
    message?: string;
    detail?: string;
    is_email_verified: boolean;
  };
}

export async function resendVerificationEmail() {
  await ensureCsrfCookie();

  const response = await fetch(
    `${API_BASE_URL}/api/onboarding/resend-verification-email/`,
    {
      method: "POST",
      credentials: "include",
      headers: getJsonCsrfHeaders(),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getFirstApiError(data, "Could not resend verification email."),
    );
  }

  return data as {
    message?: string;
    detail?: string;
  };
}
