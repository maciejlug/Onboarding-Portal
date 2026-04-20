import StepContainer from "../../components/StepContainer/StepContainer";
import { ONBOARDING_STEPS, type OnboardingStep } from "../../onboarding/steps";
import AccountStep from "../../onboarding/OnboardingPages/AccountStep";
import ProfileStep from "../../onboarding/OnboardingPages/ProfileStep";
import "./OnboardingPage.css";
import { useOnboardingFlow } from "../../onboarding/hooks/useOnboardingFlow";

export default function OnboardingPage() {
  const { currentStep, accountData, setAccountData, canGoNext, handleNext } =
    useOnboardingFlow();

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
