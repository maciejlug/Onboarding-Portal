import type { SetStateAction, Dispatch } from "react";
import type { OnboardingStep } from "../onboarding/steps";

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
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
};

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "prefer_not_to_say" | "";
  countryOfBirth: string;
  dateOfBirth: string;
};

export type ContactFormData = {
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

// Step component props
export type AccountStepProps = {
  formData: AccountFormData;
  setFormData: Dispatch<SetStateAction<OnboardingFormData>>;
  onNext: () => void;
};

export type ProfileStepProps = {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onBack: () => void;
  isEditingFromSummary: boolean;
};

export type ContactStepProps = {
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onBack: () => void;
  isEditingFromSummary: boolean;
};

export type SummaryStepProps = {
  formData: OnboardingFormData;
  onEditStep: (step: OnboardingStep) => void;
  onFinish: () => void;
};

// Shared onboarding form state
export type OnboardingFormData = {
  account: AccountFormData;
  profile: ProfileFormData;
  contact: ContactFormData;
};
