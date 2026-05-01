from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully."})
    
@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=400,
            )

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid email or password."},
                status=400,
            )

        user = authenticate(
            request,
            username=user_obj.username,
            password=password,
        )

        if user is None:
            return Response(
                {"detail": "Invalid email or password."},
                status=400,
            )

        login(request, user)

        return Response({
            "message": "Logged in successfully.",
            "email": user.email,
        })