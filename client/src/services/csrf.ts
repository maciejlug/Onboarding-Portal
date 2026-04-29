import { API_BASE_URL } from "../config/api";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? "";
  }
  return "";
}

export async function ensureCsrfCookie() {
  await fetch(`${API_BASE_URL}/api/onboarding/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}
