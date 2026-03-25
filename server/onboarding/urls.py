from django.urls import path

from .views import OnboardingDetailView, OnboardingView

urlpatterns = [
    path("", OnboardingView.as_view(), name="onboarding-list-create"),
    path("<int:pk>/", OnboardingDetailView.as_view(), name="onboarding-detail"),
]