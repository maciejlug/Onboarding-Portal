from rest_framework import serializers

from .models import OnboardingSession


class OnboardingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingSession
        fields = ["id", "status", "account_type", "created_at", "updated_at"]