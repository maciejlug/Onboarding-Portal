from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import OnboardingStartSerializer


class OnboardingStartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OnboardingStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        onboarding = serializer.save()

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