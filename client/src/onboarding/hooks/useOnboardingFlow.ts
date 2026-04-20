import { useMemo, useState } from "react";
import { ONBOARDING_STEPS, type OnboardingStep } from "../steps";
import type { AccountFormData } from "../../types/onboarding";

export function useOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    ONBOARDING_STEPS.ACCOUNT,
  );

  const [accountData, setAccountData] = useState<AccountFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const canGoNext = useMemo(() => {
    if (currentStep === ONBOARDING_STEPS.ACCOUNT) {
      return (
        accountData.email.trim() !== "" &&
        accountData.password.trim() !== "" &&
        accountData.confirmPassword.trim() !== "" &&
        accountData.password === accountData.confirmPassword
      );
    }

    return true;
  }, [currentStep, accountData]);

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
    accountData,
    setAccountData,
    canGoNext,
    handleNext,
  };
}
