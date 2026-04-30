import { API_BASE_URL } from "../config/api";

export type CurrentUserResponse = {
  is_authenticated: boolean;
  email: string;
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
