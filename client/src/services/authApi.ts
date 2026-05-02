import { API_BASE_URL } from "../config/api";
import { getJsonCsrfHeaders } from "./csrf";

export type CurrentUserResponse = {
  is_authenticated: boolean;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not fetch current user.");
  }

  return response.json();
}

export async function loginUser(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: await getJsonCsrfHeaders(),
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Could not log in.");
  }

  return data as {
    message?: string;
    detail?: string;
    email: string;
  };
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: await getJsonCsrfHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Could not log out.");
  }

  return data as {
    message?: string;
    detail?: string;
  };
}
