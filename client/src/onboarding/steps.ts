export const ONBOARDING_STEPS = {
  ACCOUNT: 1,
  PROFILE: 2,
  ACCOUNT_TYPE: 3,
  SUMMARY: 4,
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];
