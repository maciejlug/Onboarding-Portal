from django.contrib import admin

from .models import OnboardingSession


@admin.register(OnboardingSession)
class OnboardingSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "account_type", "created_at", "updated_at")
    list_filter = ("status", "account_type")
    search_fields = ("id",)