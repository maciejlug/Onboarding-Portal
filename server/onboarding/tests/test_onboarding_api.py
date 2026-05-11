from unittest.mock import patch

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from onboarding.models import OnboardingSession


class OnboardingApiTests(APITestCase):
    def start_onboarding(self, email="test@example.com"):
        payload = {
            "email": email,
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123!",
            "accept_terms": True,
            "accept_privacy_policy": True,
        }

        return self.client.post(
            "/api/onboarding/start/",
            payload,
            format="json",
        )

    @patch("onboarding.views.send_verification_email")
    def test_start_onboarding_creates_user_and_session(self, mock_send_email):
        response = self.start_onboarding(email="start@example.com")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "in_progress")
        self.assertEqual(response.data["current_step"], 2)
        self.assertEqual(response.data["email"], "start@example.com")

        user = User.objects.get(email="start@example.com")
        onboarding = OnboardingSession.objects.get(user=user)

        self.assertEqual(onboarding.status, "in_progress")
        self.assertEqual(onboarding.current_step, 2)
        self.assertFalse(onboarding.is_email_verified)
        self.assertTrue(onboarding.accept_terms)
        self.assertTrue(onboarding.accept_privacy_policy)
        self.assertTrue(onboarding.email_verification_token)

        mock_send_email.assert_called_once()

    @patch("onboarding.views.send_verification_email")
    def test_start_onboarding_logs_user_in(self, mock_send_email):
        self.start_onboarding(email="logged@example.com")

        response = self.client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_authenticated"], True)
        self.assertEqual(response.data["email"], "logged@example.com")

    def test_onboarding_me_requires_authenticated_user(self):
        response = self.client.get("/api/onboarding/me/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("onboarding.views.send_verification_email")
    def test_get_onboarding_me_returns_current_session_data(self, mock_send_email):
        self.start_onboarding(email="me@example.com")

        response = self.client.get("/api/onboarding/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "me@example.com")
        self.assertEqual(response.data["status"], "in_progress")
        self.assertEqual(response.data["current_step"], 2)
        self.assertEqual(response.data["is_email_verified"], False)

    @patch("onboarding.views.send_verification_email")
    def test_update_profile_data(self, mock_send_email):
        self.start_onboarding(email="profile@example.com")

        response = self.client.patch(
            "/api/onboarding/me/",
            {
                "first_name": "John",
                "last_name": "Doe",
                "gender": "male",
                "country_of_birth": "Poland",
                "date_of_birth": "1998-05-12",
                "current_step": 3,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = User.objects.get(email="profile@example.com")
        onboarding = OnboardingSession.objects.get(user=user)

        self.assertEqual(onboarding.first_name, "John")
        self.assertEqual(onboarding.last_name, "Doe")
        self.assertEqual(onboarding.gender, "male")
        self.assertEqual(onboarding.country_of_birth, "Poland")
        self.assertEqual(str(onboarding.date_of_birth), "1998-05-12")
        self.assertEqual(onboarding.current_step, 3)

        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")

    @patch("onboarding.views.send_verification_email")
    def test_update_contact_data(self, mock_send_email):
        self.start_onboarding(email="contact@example.com")

        response = self.client.patch(
            "/api/onboarding/me/",
            {
                "phone": "123456789",
                "street": "Main Street 1",
                "city": "Krakow",
                "postal_code": "30-001",
                "country": "Poland",
                "current_step": 4,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = User.objects.get(email="contact@example.com")
        onboarding = OnboardingSession.objects.get(user=user)

        self.assertEqual(onboarding.phone, "123456789")
        self.assertEqual(onboarding.street, "Main Street 1")
        self.assertEqual(onboarding.city, "Krakow")
        self.assertEqual(onboarding.postal_code, "30-001")
        self.assertEqual(onboarding.country, "Poland")
        self.assertEqual(onboarding.current_step, 4)

    @patch("onboarding.views.send_verification_email")
    def test_verify_email_sets_email_as_verified_and_invalidates_token(
        self,
        mock_send_email,
    ):
        self.start_onboarding(email="verify@example.com")

        user = User.objects.get(email="verify@example.com")
        onboarding = OnboardingSession.objects.get(user=user)
        token = onboarding.email_verification_token

        response = self.client.get(f"/api/onboarding/verify-email/?token={token}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["is_email_verified"], True)

        onboarding.refresh_from_db()

        self.assertTrue(onboarding.is_email_verified)
        self.assertEqual(onboarding.email_verification_token, "")

    @patch("onboarding.views.send_verification_email")
    def test_reused_verification_token_for_logged_user_returns_already_verified(
        self,
        mock_send_email,
    ):
        self.start_onboarding(email="reused@example.com")

        user = User.objects.get(email="reused@example.com")
        onboarding = OnboardingSession.objects.get(user=user)
        token = onboarding.email_verification_token

        first_response = self.client.get(
            f"/api/onboarding/verify-email/?token={token}",
        )

        second_response = self.client.get(
            f"/api/onboarding/verify-email/?token={token}",
        )

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(first_response.data["is_email_verified"], True)

        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.data["is_email_verified"], True)

    @patch("onboarding.views.send_verification_email")
    def test_resend_verification_email_generates_new_token(self, mock_send_email):
        self.start_onboarding(email="resend@example.com")

        user = User.objects.get(email="resend@example.com")
        onboarding = OnboardingSession.objects.get(user=user)
        old_token = onboarding.email_verification_token

        response = self.client.post(
            "/api/onboarding/resend-verification-email/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        onboarding.refresh_from_db()

        self.assertTrue(onboarding.email_verification_token)
        self.assertNotEqual(onboarding.email_verification_token, old_token)
        self.assertEqual(mock_send_email.call_count, 2)

    @patch("onboarding.views.send_verification_email")
    def test_finish_onboarding_sets_status_completed(self, mock_send_email):
        self.start_onboarding(email="finish@example.com")

        response = self.client.post(
            "/api/onboarding/finish/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "completed")

        user = User.objects.get(email="finish@example.com")
        onboarding = OnboardingSession.objects.get(user=user)

        self.assertEqual(onboarding.status, "completed")