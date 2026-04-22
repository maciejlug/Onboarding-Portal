import { useState } from "react";
import { ONBOARDING_STEPS, type OnboardingStep } from "../steps";
import type { OnboardingFormData } from "../../types/onboarding";

export function useOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    ONBOARDING_STEPS.ACCOUNT,
  );

  const [isEditingFromSummary, setIsEditingFromSummary] = useState(false);

  function handleEditStep(step: OnboardingStep) {
    setIsEditingFromSummary(true);
    setCurrentStep(step);
  }

  function handleFinish() {
    console.log("Finish onboarding", formData);
    //todo: submit data to backend and handle response
  }

  const [formData, setFormData] = useState<OnboardingFormData>({
    account: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptPrivacyPolicy: false,
    },
    profile: {
      firstName: "",
      lastName: "",
      gender: "",
      countryOfBirth: "",
      dateOfBirth: "",
    },
    contact: {
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  function handleNext() {
    if (isEditingFromSummary) {
      setCurrentStep(ONBOARDING_STEPS.SUMMARY);
      setIsEditingFromSummary(false);
      return;
    }

    if (currentStep === ONBOARDING_STEPS.ACCOUNT) {
      setCurrentStep(ONBOARDING_STEPS.PROFILE);
      return;
    }

    if (currentStep === ONBOARDING_STEPS.PROFILE) {
      setCurrentStep(ONBOARDING_STEPS.CONTACT);
      return;
    }

    if (currentStep === ONBOARDING_STEPS.CONTACT) {
      setCurrentStep(ONBOARDING_STEPS.SUMMARY);
    }
  }

  return {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleEditStep,
    handleFinish,
  };
}
