from django.contrib.auth import get_user_model, login
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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
        get_token(request)
        return Response({"message": "CSRF cookie set."})


class OnboardingStartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OnboardingStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        onboarding = serializer.save()

        login(request, onboarding.user)
        get_token(request)

        return Response(
            {
                "message": "Onboarding started successfully.",
                "user_id": onboarding.user.id,
                "onboarding_id": onboarding.id,
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