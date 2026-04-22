import StepContainer from "../../components/StepContainer/StepContainer";
import { ONBOARDING_STEPS, type OnboardingStep } from "../../onboarding/steps";
import AccountStep from "../../onboarding/OnboardingPages/AccountStep";
import ProfileStep from "../../onboarding/OnboardingPages/ProfileStep";
import ContactStep from "../../onboarding/OnboardingPages/ContactStep";
import "./OnboardingPage.css";
import { useOnboardingFlow } from "../../onboarding/hooks/useOnboardingFlow";
import SummaryStep from "../../onboarding/OnboardingPages/SummaryStep";

export default function OnboardingPage() {
  const {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleEditStep,
    handleFinish,
    handleBack,
    isEditingFromSummary,
  } = useOnboardingFlow();

  const stepMap: Record<OnboardingStep, React.ReactNode> = {
    [ONBOARDING_STEPS.ACCOUNT]: (
      <AccountStep
        formData={formData.account}
        setFormData={setFormData}
        onNext={handleNext}
      />
    ),
    [ONBOARDING_STEPS.PROFILE]: (
      <ProfileStep
        formData={formData.profile}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
        isEditingFromSummary={isEditingFromSummary}
      />
    ),
    [ONBOARDING_STEPS.CONTACT]: (
      <ContactStep
        formData={formData.contact}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
        isEditingFromSummary={isEditingFromSummary}
      />
    ),
    [ONBOARDING_STEPS.SUMMARY]: (
      <SummaryStep
        formData={formData}
        onEditStep={handleEditStep}
        onFinish={handleFinish}
      />
    ),
  };

  return <StepContainer>{stepMap[currentStep]}</StepContainer>;
}
