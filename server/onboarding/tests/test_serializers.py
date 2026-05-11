from django.contrib.auth.models import User
from django.test import TestCase

from onboarding.models import OnboardingSession
from onboarding.serializers import (
    EmailAvailabilitySerializer,
    OnboardingSessionSerializer,
    OnboardingStartSerializer,
    OnboardingUpdateSerializer,
)


class OnboardingStartSerializerTests(TestCase):
    def get_valid_payload(self, email="test@example.com"):
        return {
            "email": email,
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123!",
            "accept_terms": True,
            "accept_privacy_policy": True,
        }

    def test_valid_payload_creates_user_and_onboarding_session(self):
        serializer = OnboardingStartSerializer(data=self.get_valid_payload())

        self.assertTrue(serializer.is_valid(), serializer.errors)

        onboarding = serializer.save()

        user = User.objects.get(email="test@example.com")

        self.assertEqual(onboarding.user, user)
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("StrongPassword123!"))

        self.assertEqual(onboarding.status, "in_progress")
        self.assertEqual(onboarding.current_step, 2)
        self.assertFalse(onboarding.is_email_verified)
        self.assertTrue(onboarding.accept_terms)
        self.assertTrue(onboarding.accept_privacy_policy)

    def test_password_confirmation_must_match(self):
        payload = self.get_valid_payload()
        payload["confirm_password"] = "DifferentPassword123!"

        serializer = OnboardingStartSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors)

    def test_email_must_be_unique(self):
        User.objects.create_user(
            username="existing@example.com",
            email="existing@example.com",
            password="StrongPassword123!",
        )

        serializer = OnboardingStartSerializer(
            data=self.get_valid_payload(email="existing@example.com"),
        )

        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors)

    def test_accept_terms_is_required(self):
        payload = self.get_valid_payload()
        payload["accept_terms"] = False

        serializer = OnboardingStartSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors)

    def test_accept_privacy_policy_is_required(self):
        payload = self.get_valid_payload()
        payload["accept_privacy_policy"] = False

        serializer = OnboardingStartSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors)


class OnboardingSessionSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="user@example.com",
            email="user@example.com",
            password="StrongPassword123!",
        )

        self.onboarding = OnboardingSession.objects.create(
            user=self.user,
            accept_terms=True,
            accept_privacy_policy=True,
            current_step=2,
        )

    def test_serializer_returns_current_onboarding_data(self):
        serializer = OnboardingSessionSerializer(instance=self.onboarding)

        self.assertEqual(serializer.data["email"], "user@example.com")
        self.assertEqual(serializer.data["status"], "in_progress")
        self.assertEqual(serializer.data["current_step"], 2)
        self.assertEqual(serializer.data["is_email_verified"], False)


class OnboardingUpdateSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="update@example.com",
            email="update@example.com",
            password="StrongPassword123!",
        )

        self.onboarding = OnboardingSession.objects.create(
            user=self.user,
            accept_terms=True,
            accept_privacy_policy=True,
            current_step=2,
        )

    def test_profile_update_updates_onboarding_session(self):
        serializer = OnboardingUpdateSerializer(
            instance=self.onboarding,
            data={
                "first_name": "John",
                "last_name": "Doe",
                "gender": "male",
                "country_of_birth": "Poland",
                "date_of_birth": "1998-05-12",
                "current_step": 3,
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        onboarding = serializer.save()

        self.assertEqual(onboarding.first_name, "John")
        self.assertEqual(onboarding.last_name, "Doe")
        self.assertEqual(onboarding.gender, "male")
        self.assertEqual(onboarding.country_of_birth, "Poland")
        self.assertEqual(str(onboarding.date_of_birth), "1998-05-12")
        self.assertEqual(onboarding.current_step, 3)

    def test_contact_update_onboarding_session(self):
        serializer = OnboardingUpdateSerializer(
            instance=self.onboarding,
            data={
                "phone": "123456789",
                "street": "Main Street 1",
                "city": "Krakow",
                "postal_code": "30-001",
                "country": "Poland",
                "current_step": 4,
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

        onboarding = serializer.save()

        self.assertEqual(onboarding.phone, "123456789")
        self.assertEqual(onboarding.street, "Main Street 1")
        self.assertEqual(onboarding.city, "Krakow")
        self.assertEqual(onboarding.postal_code, "30-001")
        self.assertEqual(onboarding.country, "Poland")
        self.assertEqual(onboarding.current_step, 4)


class EmailAvailabilitySerializerTests(TestCase):
    def test_email_availability_serializer_accepts_valid_email(self):
        serializer = EmailAvailabilitySerializer(data={"email": "test@example.com"})

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_email_availability_serializer_rejects_invalid_email(self):
        serializer = EmailAvailabilitySerializer(data={"email": "not-an-email"})

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)