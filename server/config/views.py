from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})

class CurrentUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response(
                {
                    "is_authenticated": True,
                    "email": request.user.email,
                }
            )

        return Response(
            {
                "is_authenticated": False,
                "email": "",
            }
        )