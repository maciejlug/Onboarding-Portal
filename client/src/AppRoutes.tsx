import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import OnboardingCompleteStep from "./onboarding/OnboardingPages/OnboardingCompleteStep";
import LoginPage from "./pages/LoginPage/LoginPage";

export default function AppRoutes() {
  return (
    <div className="page-width">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/onboarding/complete"
          element={<OnboardingCompleteStep />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
