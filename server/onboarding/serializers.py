from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import OnboardingSession

User = get_user_model()


class OnboardingStartSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    accept_terms = serializers.BooleanField()
    accept_privacy_policy = serializers.BooleanField()

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        if not attrs["accept_terms"]:
            raise serializers.ValidationError(
                {"accept_terms": "You must accept the terms and conditions."}
            )

        if not attrs["accept_privacy_policy"]:
            raise serializers.ValidationError(
                {"accept_privacy_policy": "You must accept the privacy policy."}
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )

        onboarding = OnboardingSession.objects.create(
            user=user,
            status="in_progress",
            current_step=2,
            is_email_verified=False,
            accept_terms=validated_data["accept_terms"],
            accept_privacy_policy=validated_data["accept_privacy_policy"],
        )

        return onboarding


class OnboardingSessionSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = OnboardingSession
        fields = [
            "id",
            "email",
            "status",
            "current_step",
            "is_email_verified",
            "accept_terms",
            "accept_privacy_policy",
            "first_name",
            "last_name",
            "gender",
            "country_of_birth",
            "date_of_birth",
            "phone",
            "street",
            "city",
            "postal_code",
            "country",
            "created_at",
            "updated_at",
        ]


class OnboardingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingSession
        fields = [
            "first_name",
            "last_name",
            "gender",
            "country_of_birth",
            "date_of_birth",
            "phone",
            "street",
            "city",
            "postal_code",
            "country",
            "current_step",
            "status",
        ]
        extra_kwargs = {
            "first_name": {"required": False},
            "last_name": {"required": False},
            "gender": {"required": False},
            "country_of_birth": {"required": False},
            "date_of_birth": {"required": False},
            "phone": {"required": False},
            "street": {"required": False},
            "city": {"required": False},
            "postal_code": {"required": False},
            "country": {"required": False},
            "current_step": {"required": False},
            "status": {"required": False},
        }