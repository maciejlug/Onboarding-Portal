from django.urls import path

from .views import CsrfCookieView, EmailAvailabilityView, OnboardingFinishView, OnboardingMeView, OnboardingStartView, ResendVerificationEmailView, VerifyEmailView

urlpatterns = [
    path("csrf/", CsrfCookieView.as_view(), name="onboarding-csrf"),
    path("start/", OnboardingStartView.as_view(), name="onboarding-start"),
    path("me/", OnboardingMeView.as_view(), name="onboarding-me"),
    path("check-email/", EmailAvailabilityView.as_view(), name="onboarding-check-email"),
    path("finish/", OnboardingFinishView.as_view(), name="onboarding-finish"),
    path(
        "resend-verification-email/",
        ResendVerificationEmailView.as_view(),
        name="onboarding-resend-verification-email",
    ),
    path("verify-email/", VerifyEmailView.as_view(), name="onboarding-verify-email"),
]