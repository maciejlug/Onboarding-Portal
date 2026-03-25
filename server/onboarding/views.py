from rest_framework.response import Response
from rest_framework.views import APIView


class OnboardingView(APIView):
    def get(self, request):
        return Response({"message": "onboarding endpoint works"})