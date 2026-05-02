import { API_BASE_URL } from "../config/api";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? "";
  }

  return "";
}

export async function ensureCsrfCookie(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/csrf/`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  return data?.csrfToken ?? getCookie("csrftoken");
}

export async function getJsonCsrfHeaders(): Promise<Record<string, string>> {
  const csrfToken = await ensureCsrfCookie();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return headers;
}
