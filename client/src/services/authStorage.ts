const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ONBOARDING_ID_KEY = "onboardingId";

export function saveAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function saveOnboardingId(onboardingId: number) {
  localStorage.setItem(ONBOARDING_ID_KEY, String(onboardingId));
}

export function getOnboardingId() {
  const value = localStorage.getItem(ONBOARDING_ID_KEY);
  return value ? Number(value) : null;
}

export function clearOnboardingId() {
  localStorage.removeItem(ONBOARDING_ID_KEY);
}
