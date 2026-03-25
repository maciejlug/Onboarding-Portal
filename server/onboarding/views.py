from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OnboardingSession
from .serializers import OnboardingSessionSerializer


class OnboardingView(APIView):
    def get(self, request):
        sessions = OnboardingSession.objects.all().order_by("-created_at")
        serializer = OnboardingSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OnboardingSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)