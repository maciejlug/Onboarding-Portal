import secrets
from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .emails import send_verification_email

from .models import OnboardingSession
from .serializers import (
    EmailAvailabilitySerializer,
    OnboardingSessionSerializer,
    OnboardingStartSerializer,
    OnboardingUpdateSerializer,
)

User = get_user_model()

@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfCookieView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)

        return Response({
            "csrfToken": csrf_token,
        })


class OnboardingStartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OnboardingStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        onboarding = serializer.save()

        login(request, onboarding.user)
        get_token(request)

        verification_token = secrets.token_urlsafe(32)
        onboarding.email_verification_token = verification_token
        onboarding.save(update_fields=["email_verification_token", "updated_at"])

        verification_url = (
            f"{settings.FRONTEND_BASE_URL}/onboarding/complete?token={verification_token}"
        )

        send_verification_email(
            to_email=onboarding.user.email,
            verification_url=verification_url,
        )

        return Response(
            {
                "message": "Onboarding started successfully.",
                "current_step": onboarding.current_step,
                "status": onboarding.status,
                "is_email_verified": onboarding.is_email_verified,
                "email": onboarding.user.email,
            },
            status=status.HTTP_201_CREATED,
        )

class OnboardingMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        return get_object_or_404(OnboardingSession, user=request.user)

    def get(self, request):
        onboarding = self.get_object(request)
        return Response(OnboardingSessionSerializer(onboarding).data)

    def patch(self, request):
        onboarding = self.get_object(request)
        serializer = OnboardingUpdateSerializer(
            onboarding,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if "first_name" in serializer.validated_data:
            onboarding.user.first_name = serializer.validated_data["first_name"]

        if "last_name" in serializer.validated_data:
            onboarding.user.last_name = serializer.validated_data["last_name"]

        onboarding.user.save()

        return Response(OnboardingSessionSerializer(onboarding).data)
    
class EmailAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = EmailAvailabilitySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        is_taken = User.objects.filter(email__iexact=email).exists()

        return Response(
            {
                "email": email,
                "is_taken": is_taken,
            }
        )

class OnboardingFinishView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        onboarding = get_object_or_404(OnboardingSession, user=request.user)
        onboarding.status = "completed"
        onboarding.current_step = 4
        onboarding.save(update_fields=["status", "current_step", "updated_at"])

        return Response(
            {
                "message": "Onboarding completed.",
                "status": onboarding.status,
                "is_email_verified": onboarding.is_email_verified,
            },
            status=status.HTTP_200_OK,
        )
    
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token", "").strip()

        onboarding = get_object_or_404(
            OnboardingSession,
            email_verification_token=token,
        )

        onboarding.is_email_verified = True
        onboarding.email_verification_token = ""
        onboarding.save(update_fields=["is_email_verified", "email_verification_token", "updated_at"])

        return Response(
            {
                "message": "Email verified successfully.",
                "is_email_verified": True,
            }
        )
    
class ResendVerificationEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        onboarding = get_object_or_404(OnboardingSession, user=request.user)

        if onboarding.is_email_verified:
            return Response(
                {"message": "Email is already verified."},
                status=200,
            )

        verification_token = secrets.token_urlsafe(32)
        onboarding.email_verification_token = verification_token
        onboarding.save(update_fields=["email_verification_token", "updated_at"])

        verification_url = (
            f"{settings.FRONTEND_BASE_URL}/onboarding/complete?token={verification_token}"
        )

        send_verification_email(
            to_email=onboarding.user.email,
            verification_url=verification_url,
        )

        return Response(
            {"message": "Verification email has been sent again."},
            status=200,
        )