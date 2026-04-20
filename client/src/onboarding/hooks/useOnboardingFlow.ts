import { useMemo, useState } from "react";
import { ONBOARDING_STEPS, type OnboardingStep } from "../steps";
import type { OnboardingFormData } from "../../types/onboarding";

export function useOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    ONBOARDING_STEPS.ACCOUNT,
  );

  const [formData, setFormData] = useState<OnboardingFormData>({
    account: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const canGoNext = useMemo(() => {
    if (currentStep === ONBOARDING_STEPS.ACCOUNT) {
      return (
        formData.account.email.trim() !== "" &&
        formData.account.password.trim() !== "" &&
        formData.account.confirmPassword.trim() !== "" &&
        formData.account.password === formData.account.confirmPassword
      );
    }

    return true;
  }, [currentStep, formData]);

  function handleNext() {
    if (!canGoNext) return;

    if (currentStep === ONBOARDING_STEPS.ACCOUNT) {
      setCurrentStep(ONBOARDING_STEPS.PROFILE);
      return;
    }

    if (currentStep === ONBOARDING_STEPS.PROFILE) {
      setCurrentStep(ONBOARDING_STEPS.ACCOUNT_TYPE);
      return;
    }

    if (currentStep === ONBOARDING_STEPS.ACCOUNT_TYPE) {
      setCurrentStep(ONBOARDING_STEPS.SUMMARY);
    }
  }

  return {
    currentStep,
    formData,
    setFormData,
    canGoNext,
    handleNext,
  };
}
