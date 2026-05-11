from django.contrib.auth.models import User
from django.test import TestCase

from onboarding.models import OnboardingSession


class OnboardingSessionModelTests(TestCase):
    def create_user(self, email="test@example.com"):
        return User.objects.create_user(
            username=email,
            email=email,
            password="StrongPassword123!",
        )

    def test_onboarding_session_default_values(self):
        user = self.create_user()

        onboarding = OnboardingSession.objects.create(
            user=user,
            accept_terms=True,
            accept_privacy_policy=True,
        )

        self.assertEqual(onboarding.user, user)
        self.assertEqual(onboarding.status, "in_progress")
        self.assertEqual(onboarding.current_step, 1)
        self.assertFalse(onboarding.is_email_verified)
        self.assertEqual(onboarding.email_verification_token, "")
        self.assertTrue(onboarding.accept_terms)
        self.assertTrue(onboarding.accept_privacy_policy)

    def test_onboarding_session_can_store_profile_data(self):
        user = self.create_user(email="profile@example.com")

        onboarding = OnboardingSession.objects.create(
            user=user,
            accept_terms=True,
            accept_privacy_policy=True,
            first_name="John",
            last_name="Doe",
            gender="male",
            country_of_birth="Poland",
            date_of_birth="1998-05-12",
        )

        self.assertEqual(onboarding.first_name, "John")
        self.assertEqual(onboarding.last_name, "Doe")
        self.assertEqual(onboarding.gender, "male")
        self.assertEqual(onboarding.country_of_birth, "Poland")
        self.assertEqual(str(onboarding.date_of_birth), "1998-05-12")

    def test_onboarding_session_can_store_contact_data(self):
        user = self.create_user(email="contact@example.com")

        onboarding = OnboardingSession.objects.create(
            user=user,
            accept_terms=True,
            accept_privacy_policy=True,
            phone="123456789",
            street="Main Street 1",
            city="Krakow",
            postal_code="30-001",
            country="Poland",
        )

        self.assertEqual(onboarding.phone, "123456789")
        self.assertEqual(onboarding.street, "Main Street 1")
        self.assertEqual(onboarding.city, "Krakow")
        self.assertEqual(onboarding.postal_code, "30-001")
        self.assertEqual(onboarding.country, "Poland")

    def test_onboarding_session_can_be_completed(self):
        user = self.create_user(email="completed@example.com")

        onboarding = OnboardingSession.objects.create(
            user=user,
            accept_terms=True,
            accept_privacy_policy=True,
        )

        onboarding.status = "completed"
        onboarding.current_step = 4
        onboarding.save()

        onboarding.refresh_from_db()

        self.assertEqual(onboarding.status, "completed")
        self.assertEqual(onboarding.current_step, 4)

    def test_onboarding_session_can_mark_email_as_verified(self):
        user = self.create_user(email="verified@example.com")

        onboarding = OnboardingSession.objects.create(
            user=user,
            accept_terms=True,
            accept_privacy_policy=True,
            email_verification_token="test-token",
        )

        onboarding.is_email_verified = True
        onboarding.email_verification_token = ""
        onboarding.save()

        onboarding.refresh_from_db()

        self.assertTrue(onboarding.is_email_verified)
        self.assertEqual(onboarding.email_verification_token, "")