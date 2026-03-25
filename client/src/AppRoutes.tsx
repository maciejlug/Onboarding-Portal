import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}