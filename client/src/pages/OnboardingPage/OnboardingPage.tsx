import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import StepContainer from "../../components/StepContainer/StepContainer";
import { ONBOARDING_STEPS, type OnboardingStep } from "../../onboarding/steps";
import AccountStep from "../../onboarding/OnboardingPages/AccountStep";
import ProfileStep from "../../onboarding/OnboardingPages/ProfileStep";
import ContactStep from "../../onboarding/OnboardingPages/ContactStep";
import SummaryStep from "../../onboarding/OnboardingPages/SummaryStep";
import "./OnboardingPage.css";
import { useOnboardingFlow } from "../../onboarding/hooks/useOnboardingFlow";
import { useAuth } from "../../context/authContext";
import { getOnboardingMe } from "../../services/onboardingApi";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);

  const {
    currentStep,
    formData,
    setFormData,
    handleNext,
    handleEditStep,
    handleFinish,
    handleBack,
    isEditingFromSummary,
    goToStep,
  } = useOnboardingFlow();

  type GenderValue = "" | "male" | "female" | "prefer_not_to_say";

  function normalizeGender(value?: string): GenderValue {
    if (value === "male") {
      return "male";
    }

    if (value === "female") {
      return "female";
    }

    if (value === "prefer_not_to_say") {
      return "prefer_not_to_say";
    }

    return "";
  }

  useEffect(() => {
    async function loadOnboardingProgress() {
      if (!user.isAuthenticated) {
        setIsLoadingOnboarding(false);
        return;
      }

      try {
        const onboarding = await getOnboardingMe();

        setFormData({
          account: {
            email: onboarding.email ?? "",
            password: "",
            confirmPassword: "",
            acceptTerms: onboarding.accept_terms ?? false,
            acceptPrivacyPolicy: onboarding.accept_privacy_policy ?? false,
          },
          profile: {
            firstName: onboarding.first_name ?? "",
            lastName: onboarding.last_name ?? "",
            gender: normalizeGender(onboarding.gender),
            countryOfBirth: onboarding.country_of_birth ?? "",
            dateOfBirth: onboarding.date_of_birth ?? "",
          },
          contact: {
            phone: onboarding.phone ?? "",
            street: onboarding.street ?? "",
            city: onboarding.city ?? "",
            postalCode: onboarding.postal_code ?? "",
            country: onboarding.country ?? "",
          },
        });

        if (onboarding.status === "completed") {
          navigate("/onboarding/complete", { replace: true });
          return;
        }

        if (
          onboarding.current_step === ONBOARDING_STEPS.PROFILE ||
          onboarding.current_step === ONBOARDING_STEPS.CONTACT ||
          onboarding.current_step === ONBOARDING_STEPS.SUMMARY
        ) {
          goToStep(onboarding.current_step);
          return;
        }

        goToStep(ONBOARDING_STEPS.PROFILE);
      } catch (error) {
        console.error("Could not load onboarding progress:", error);
      } finally {
        setIsLoadingOnboarding(false);
      }
    }

    loadOnboardingProgress();
  }, [user.isAuthenticated, navigate, goToStep, setFormData]);

  const stepMap: Record<OnboardingStep, ReactNode> = {
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

  if (isLoadingOnboarding) {
    return <StepContainer>Loading...</StepContainer>;
  }

  return <StepContainer>{stepMap[currentStep]}</StepContainer>;
}
