import { API_BASE_URL } from "../config/api";

let csrfToken = "";

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

  csrfToken = data?.csrfToken ?? getCookie("csrftoken");

  return csrfToken;
}

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  return ensureCsrfCookie();
}
