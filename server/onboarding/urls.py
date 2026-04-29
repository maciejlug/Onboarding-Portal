from django.urls import path

from .views import OnboardingStartView

urlpatterns = [
    path("start/", OnboardingStartView.as_view(), name="onboarding-start"),
]