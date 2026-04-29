from django.contrib.auth import login
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OnboardingSession
from .serializers import (
    OnboardingSessionSerializer,
    OnboardingStartSerializer,
    OnboardingUpdateSerializer,
)


class CsrfCookieView(APIView):
    permission_classes = [AllowAny]

    @ensure_csrf_cookie
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
        serializer = OnboardingSessionSerializer(onboarding)
        get_token(request)
        return Response(serializer.data)

    def patch(self, request):
        onboarding = self.get_object(request)
        serializer = OnboardingUpdateSerializer(
            onboarding,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        get_token(request)
        return Response(OnboardingSessionSerializer(onboarding).data)