from django.contrib import admin

from .models import OnboardingSession


@admin.register(OnboardingSession)
class OnboardingSessionAdmin(admin.ModelAdmin):
    search_fields = ("id",)