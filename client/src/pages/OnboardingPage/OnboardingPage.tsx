import { useMemo, useState } from "react";
import StepContainer from "../../components/StepContainer/StepContainer";
import { ONBOARDING_STEPS, type OnboardingStep } from "../../onboarding/steps";
import AccountStep from "../../onboarding/OnboardingPages/AccountStep";
import ProfileStep from "../../onboarding/OnboardingPages/ProfileStep";
import "./OnboardingPage.css";

type AccountFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function OnboardingPage() {
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
  }

  const stepMap: Record<OnboardingStep, React.ReactNode> = {
    [ONBOARDING_STEPS.ACCOUNT]: (
      <AccountStep
        accountData={accountData}
        setAccountData={setAccountData}
        onNext={handleNext}
        canGoNext={canGoNext}
      />
    ),
    [ONBOARDING_STEPS.PROFILE]: <ProfileStep onNext={handleNext} />,
    [ONBOARDING_STEPS.ACCOUNT_TYPE]: <div>Account type step</div>,
    [ONBOARDING_STEPS.SUMMARY]: <div>Summary step</div>,
  };

  return <StepContainer>{stepMap[currentStep]}</StepContainer>;
}
