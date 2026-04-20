import type { SetStateAction, Dispatch } from "react";

//API types
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

// Step data types
export type AccountFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
};

// Step component props
export type AccountStepProps = {
  formData: AccountFormData;
  setFormData: Dispatch<SetStateAction<AccountFormData>>;
  onNext: () => void;
};

export type ProfileStepProps = {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  onNext: () => void;
};

// Shared onboarding form state
export type OnboardingFormData = {
  account: AccountFormData;
  profile: ProfileFormData;
};
