from django.contrib import admin
from .models import OnboardingSession


@admin.register(OnboardingSession)
class OnboardingSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "current_step",
        "is_email_verified",
        "created_at",
        "updated_at",
    )
    list_filter = (
        "status",
        "is_email_verified",
        "current_step",
        "created_at",
    )
    search_fields = (
        "user__email",
        "first_name",
        "last_name",
        "phone",
        "city",
        "country",
    )

    def __str__(self):
        return f"{self.user.email} - step {self.current_step} - {self.status}"