export type OnboardingSession = {
  id: number;
  status: string;
  account_type: string;
  created_at: string;
  updated_at: string;
};

export type CreateOnboardingSessionPayload = {
  status: string;
  account_type: string;
};

export type AccountFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
