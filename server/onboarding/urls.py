from django.urls import path

from .views import CsrfCookieView, OnboardingMeView, OnboardingStartView

urlpatterns = [
    path("csrf/", CsrfCookieView.as_view(), name="onboarding-csrf"),
    path("start/", OnboardingStartView.as_view(), name="onboarding-start"),
    path("me/", OnboardingMeView.as_view(), name="onboarding-me"),
]